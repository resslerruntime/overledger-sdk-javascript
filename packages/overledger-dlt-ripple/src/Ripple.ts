import { RippleAPI } from 'ripple-lib';
import { dropsToXrp } from 'ripple-lib/dist/npm/common';
import { deriveKeypair, deriveAddress } from 'ripple-keypairs';
import AbstractDLT from '@quantnetwork/overledger-dlt-abstract';
import { Account, Options, TransactionOptions as BaseTransactionOptions } from '@quantnetwork/overledger-types';
import { Payment } from 'ripple-lib/dist/npm/transaction/payment';
import { Instructions } from 'ripple-lib/dist/npm/transaction/types';
import { EscrowCreation } from 'ripple-lib/dist/npm/transaction/escrow-creation';
import { EscrowExecution } from 'ripple-lib/dist/npm/transaction/escrow-execution';
import { EscrowCancellation } from 'ripple-lib/dist/npm/transaction/escrow-cancellation';
import * as cc from 'five-bells-condition';

/**
 * @memberof module:overledger-dlt-ripple
*/
class Ripple extends AbstractDLT {
  rippleAPI: RippleAPI;
  account: Account;
  options: Object;
  /**
   * Name of the DLT
   */
  name: string = 'ripple';

  /**
   * Symbol of the DLT
   */
  symbol: string = 'XRP';

  /**
   * @param {any} sdk
   * @param {Object} options
   */
  // @TODO: add options statement
  constructor(sdk: any, options: Options = {}) {
    super(sdk, options);

    this.options = options;

    this.rippleAPI = new RippleAPI();

    if (options.privateKey) {
      this.setAccount(options.privateKey);
    }
  }

  /**
   * Create an account for a specific DLT
   *
   * @return {Account}
   */
  createAccount(): Account {
    const generated = this.rippleAPI.generateAddress();

    const account = {
      address: generated.address,
      privateKey: generated.secret,
    };

    return account;
  }

  /**
   * Set an account for signing for a specific DLT
   *
   * @param {string} privateKey The privateKey
   */
  setAccount(privateKey: string): void {
    const keypair = deriveKeypair(privateKey);
    const account = {
      privateKey,
      address: keypair.publicKey,
    };
    account.address = deriveAddress(keypair.publicKey);
    this.account = account;
  }

  /**
   * Build the transaction
   *
   * @param {string} toAddress
   * @param {string} message
   * @param {TransactionOptions} options
   */
  buildTransaction(toAddress: string, message: string, options: TransactionOptions): Transaction {
    let payment;
    let escrowCreation: EscrowCreation;
    let escrowExecution: EscrowExecution;
    let escrowCancellation: EscrowCancellation;
    
    if (typeof options === 'undefined') {
      throw new Error('Transaction options must be defined.');
    }

    if (typeof options.amount === 'undefined') {
      throw new Error('options.amount must be set up');
    }

    if (typeof options.feePrice === 'undefined') {
      throw new Error('options.feePrice must be set up');
    }

    if (typeof options.sequence === 'undefined') {
      throw new Error('options.sequence must be set up');
    }

    if (typeof options.maxLedgerVersion === 'undefined') {
      throw new Error('options.maxLedgerVersion must be set up');
    }
    const maxLedgerVersion = Number(options.maxLedgerVersion);
    const amountInXRP = dropsToXrp(options.amount);
    const feeInXRP = dropsToXrp(options.feePrice);

    const address = this.account.address;
    if (options.transactionType === "PAYMENT") {
      payment = {
        source: {
          address: this.account.address,
          amount: {
            value: amountInXRP,
            currency: 'XRP',
          },
        },
        destination: {
          address: toAddress,
          minAmount: {
            value: amountInXRP,
            currency: 'XRP',
          },
        },
        memos: [{
          data: message,
        }],
      };
    }
    const instructions = {
      maxLedgerVersion,
      sequence: options.sequence,
      fee: feeInXRP,
    };

    if (options.atomicSwapParameters) {
      const params = options.atomicSwapParameters;
      switch (options.transactionType) {
        case "ESCROW_CREATION":
          let paramsCreate = params as AtomicSwapCreateOptions;
          escrowCreation = {
            amount: options.amount,
            destination: toAddress,
            allowCancelAfter: this.computeCreateEscrowCancelAfter(paramsCreate.allowCancelAfter),
            allowExecuteAfter: this.computeCreateEscrowCancelAfter(paramsCreate.allowExecuteAfter),
            condition: this.computeEscrowConditionFulfillment(paramsCreate.condition).escrowCondition
          }
          console.log('escrowCreation', escrowCreation);
          console.log('allowCancelAfter', escrowCreation.allowCancelAfter);
          break;
        case "ESCROW_EXECUTION":
          let paramsExecute = params as AtomicSwapExecuteOptions;
          escrowExecution = {
            owner: address,
            escrowSequence: parseInt(paramsExecute.escrowSequence),
            condition: this.computeEscrowConditionFulfillment(paramsCreate.condition).escrowCondition,
            fulfillment: this.computeEscrowConditionFulfillment(paramsCreate.condition).escrowFulfillment
          }
          console.log('escrowExecution', escrowExecution);
          break;
        case "ESCROW_CANCELLATION":
          let paramsCancel = params as AtomicSwapCancelOptions;
          escrowCancellation = {
            owner: address,
            escrowSequence: parseInt(paramsCancel.escrowSequence)
          }
          console.log('escrowCancellation', escrowCancellation);
          break;
      }
    }

    return { address, payment, instructions, escrowCreation, escrowExecution, escrowCancellation };
  }

  computeEscrowConditionFulfillment(condition: string): { escrowCondition: string, escrowFulfillment: string } {
    const preImageData = Buffer.from(condition, 'utf-8');
    const myFulfillment = new cc.PreimageSha256();
    myFulfillment.setPreimage(preImageData);
    const escrowCondition = myFulfillment.getConditionBinary().toString('hex').toUpperCase();
    const escrowFulfillment = myFulfillment.serializeBinary().toString('hex').toUpperCase();
    return { escrowCondition, escrowFulfillment };
  }

  computeCreateEscrowCancelAfter(timeDelay: string): string {
    let cancelAfter = new Date();
    return new Date(cancelAfter.setHours(cancelAfter.getHours() + parseInt(timeDelay))).toISOString();
  }


  /**
   * Sign the transaction
   *
   * @param {string} toAddress
   * @param {string} message
   * @param {TransactionOptions} options
   */
  async _sign(toAddress: string, message: string, options: TransactionOptions): Promise<string> {
    try {
      const built = this.buildTransaction(toAddress, message, options);
      let prepared;
      console.log('transaction type', options.transactionType);
      switch (options.transactionType) {
        case "PAYMENT":
          prepared = await this.rippleAPI.preparePayment(built.address, built.payment, built.instructions);
          break;
        case "ESCROW_CREATION":
          prepared = await this.rippleAPI.prepareEscrowCreation(built.address, built.escrowCreation, built.instructions);
          break;
        case "ESCROW_EXECUTION":
          prepared = await this.rippleAPI.prepareEscrowExecution(built.address, built.escrowExecution, built.instructions);
          break;
        case "ESCROW_CANCELLATION":
          prepared = await this.rippleAPI.prepareEscrowCancellation(built.address, built.escrowCancellation, built.instructions)
          break;
        default:
          prepared = await this.rippleAPI.preparePayment(built.address, built.payment, built.instructions);
      }
      return this.rippleAPI.sign(prepared.txJSON, this.account.privateKey).signedTransaction;

    } catch (e) {
      console.error(`Error while sending a ripple transaction`, e);
    }
  }
}

export type Transaction = {
  address: string,
  payment: Payment,
  instructions?: Instructions,
  escrowCreation?: EscrowCreation,
  escrowExecution?: EscrowExecution,
  escrowCancellation?: EscrowCancellation
};

interface TransactionOptions extends BaseTransactionOptions {
  feePrice: string;
  maxLedgerVersion: string;
  amount: string;
  transactionType: TransactionTypes;
  atomicSwapParameters?: AtomicSwapCreateOptions | AtomicSwapExecuteOptions | AtomicSwapCancelOptions;
}

enum TransactionTypes {
  payment = "PAYMENT",
  escrowCreation = "ESCROW_CREATION",
  escrowExecution = "ESCROW_EXECUTION",
  escrowCancellation = "ESCROW_CANCELLATION"
}

interface AtomicSwapOptions { }

interface AtomicSwapCreateOptions extends AtomicSwapOptions {
  allowCancelAfter?: string; //in ISOString format
  allowExecuteAfter?: string;
  condition?: string; //this is the sha256 hashOutput
}

interface AtomicSwapExecuteOptions extends AtomicSwapOptions {
  owner: string;
  escrowSequence: string;
  condition?: string;
  fulfillment?: string;
}

interface AtomicSwapCancelOptions extends AtomicSwapOptions {
  owner: string;
  escrowSequence: string;
}

export default Ripple;
