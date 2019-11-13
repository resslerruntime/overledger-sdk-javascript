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
            allowCancelAfter: paramsCreate.allowCancelAfter,
            allowExecuteAfter: paramsCreate.allowExecuteAfter,
            condition: this.computeEscrowConditionFulfillment(paramsCreate.condition).escrowCondition,
            memos: [{
              data: message,
            }]
          }
          console.log('escrowCreation', escrowCreation);
          break;
        case "ESCROW_EXECUTION":
          let paramsExecute = params as AtomicSwapExecuteOptions;
          let conditionAndFulfillment = this.computeEscrowConditionFulfillment(paramsExecute.condition);
          escrowExecution = {
            owner: address,
            escrowSequence: parseInt(paramsExecute.escrowSequence),
            condition: conditionAndFulfillment.escrowCondition,
            fulfillment: conditionAndFulfillment.escrowFulfillment,
            memos: [{
              data: message,
            }]
          }
          console.log('escrowExecution', escrowExecution);
          break;
        case "ESCROW_CANCELLATION":
          let paramsCancel = params as AtomicSwapCancelOptions;
          escrowCancellation = {
            owner: address,
            escrowSequence: parseInt(paramsCancel.escrowSequence),
            memos: [{
              data: message,
            }]
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
        case 'PAYMENT':
          prepared = await this.rippleAPI.preparePayment(built.address, built.payment, built.instructions);
          break;
        case 'ESCROW_CREATION':
          prepared = await this.rippleAPI.prepareEscrowCreation(built.address, built.escrowCreation, built.instructions);
          break;
        case 'ESCROW_EXECUTION':
          prepared = await this.rippleAPI.prepareEscrowExecution(built.address, built.escrowExecution, built.instructions);
          break;
        case 'ESCROW_CANCELLATION':
          prepared = await this.rippleAPI.prepareEscrowCancellation(built.address, built.escrowCancellation, built.instructions);
          break;
        default:
          prepared = await this.rippleAPI.preparePayment(built.address, built.payment, built.instructions);
      }
      return this.rippleAPI.sign(prepared.txJSON, this.account.privateKey).signedTransaction;

    } catch (e) {
      console.log(JSON.stringify(e));
      console.error(`Error while sending a ripple transaction`, e);
      if(e.toString().includes(`does not conform to the "date-time" format`)){
        console.log(`Date allowCancelAfter and allowExecuteAfter should follow the ISO 8601 format YYYY-MM-DDTHH:mm:ss.sssZ`);
      }

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

export enum TransactionTypes {
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
  escrowSequence: string;
  condition?: string;
}

interface AtomicSwapCancelOptions extends AtomicSwapOptions {
  escrowSequence: string;
}

export default Ripple;
