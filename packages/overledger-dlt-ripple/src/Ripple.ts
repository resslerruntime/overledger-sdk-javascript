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
import { isValidClassicAddress, isValidXAddress } from 'ripple-address-codec';
// import * as base58check from 'base58check';

const DEFAULT_FEE_PRICE = 12;
const BASE_ESCROW_EXECUTION_FEE_PRICE = 330;

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
    if (!this.isValidRippleAddress(account.address)) {
      throw new Error(`The account's address must be in a base58 format and of length ??`)
    }
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
    let fee;
    const address = this.account.address;
    if (options.transactionType === TransactionTypes.payment) {
      fee = this.computeFeePrice(options.feePrice, TransactionTypes.payment);
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
    } else if (options.atomicSwapParameters) {
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
          fee = this.computeFeePrice(options.feePrice, TransactionTypes.escrowCreation);
          console.log('escrowCreation', escrowCreation);
          break;
        case "ESCROW_EXECUTION":
          let paramsExecute = params as AtomicSwapExecuteOptions;
          let conditionAndFulfillment = this.computeEscrowConditionFulfillment(paramsExecute.condition);
          escrowExecution = {
            owner: paramsExecute.owner,
            escrowSequence: parseInt(paramsExecute.escrowSequence),
            condition: conditionAndFulfillment.escrowCondition,
            fulfillment: conditionAndFulfillment.escrowFulfillment,
            memos: [{
              data: message,
            }]
          }
          fee = this.computeFeePrice(options.feePrice, TransactionTypes.escrowExecution, escrowExecution.fulfillment!);
          console.log('escrowExecution', escrowExecution);
          break;
        case "ESCROW_CANCELLATION":
          let paramsCancel = params as AtomicSwapCancelOptions;
          escrowCancellation = {
            owner: paramsCancel.owner,
            escrowSequence: parseInt(paramsCancel.escrowSequence),
            memos: [{
              data: message,
            }]
          }
          fee = this.computeFeePrice(options.feePrice, TransactionTypes.escrowCancellation);
          console.log('escrowCancellation', escrowCancellation);
          break;
      }
    }

    const feeInXRP = dropsToXrp(fee.toString());
    const instructions = {
      maxLedgerVersion,
      sequence: options.sequence,
      fee: feeInXRP,
    };

    return { address, payment, instructions, escrowCreation, escrowExecution, escrowCancellation };
  }



  /**
   * Sign the transaction
   *
   * @param {string} toAddress
   * @param {string} message
   * @param {TransactionOptions} options
   */
  async _sign(toAddress: string, message: string, options: TransactionOptions): Promise<string> {
    const swapOptions = options.atomicSwapParameters;
    this.validateSignArgs(toAddress, options.sequence, options.transactionType, swapOptions);
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
    }
  }

  computeEscrowConditionFulfillment(condition: string): { escrowCondition: string, escrowFulfillment: string } {
    const preImageData = Buffer.from(condition, 'utf-8');
    const myFulfillment = new cc.PreimageSha256();
    myFulfillment.setPreimage(preImageData);
    const escrowCondition = myFulfillment.getConditionBinary().toString('hex').toUpperCase();
    const escrowFulfillment = myFulfillment.serializeBinary().toString('hex').toUpperCase();
    return { escrowCondition, escrowFulfillment };
  }

  isValidRippleAddress(address: string): boolean {
    return isValidClassicAddress(address) || isValidXAddress(address);
  }

  validateSignArgs(toAddress: string, sequence: number, transactionType: TransactionTypes, swapOptions: AtomicSwapOptions): boolean {
    if (!this.isValidRippleAddress(toAddress)) {
      throw new Error(`The toAddress must be in a base58 format and of length ??`);
    }
    if ((swapOptions as AtomicSwapCreateOptions).allowCancelAfter && !this.isValidISODateFormat((swapOptions as AtomicSwapCreateOptions).allowCancelAfter)) {
      throw new Error(`allowCancelAfter ${(swapOptions as AtomicSwapCreateOptions).allowCancelAfter} date format is not valid`);
    }
    if ((swapOptions as AtomicSwapCreateOptions).allowExecuteAfter && !this.isValidISODateFormat((swapOptions as AtomicSwapCreateOptions).allowExecuteAfter)) {
      throw new Error(`allowExecuteAfter ${(swapOptions as AtomicSwapCreateOptions).allowCancelAfter} date format is not valid`);
    }
    if ((swapOptions as AtomicSwapCreateOptions | AtomicSwapExecuteOptions).condition && (((swapOptions as AtomicSwapCreateOptions | AtomicSwapExecuteOptions).condition.length <= 0) || (typeof (swapOptions as AtomicSwapCreateOptions | AtomicSwapExecuteOptions).condition !== 'string'))) {
      throw new Error(`condition must be a non null string`);
    }
    if (!(typeof parseInt((swapOptions as AtomicSwapExecuteOptions | AtomicSwapCancelOptions).escrowSequence, 10) === 'number')) {
      throw new Error(`escrow sequence must be a number`);
    }
    if (!(typeof sequence === 'number')) {
      throw new Error(`sequence must be a number`);
    }
    if (((swapOptions as AtomicSwapExecuteOptions | AtomicSwapCancelOptions).owner) && !this.isValidRippleAddress((swapOptions as AtomicSwapExecuteOptions | AtomicSwapCancelOptions).owner)) {
      console.log(`owner`, (swapOptions as AtomicSwapExecuteOptions | AtomicSwapCancelOptions).owner);
      throw new Error(`the owner address is not valid as a ripple address format`);
    }
    if (!transactionType || !(typeof transactionType === 'string') || (transactionType.length === 0)) {
      throw new Error(`The transactionType must be set up from the enum TransactionTypes`);
    }
    return true;
  }

  computeFeePrice(initialFee: string, transactionType: TransactionTypes, fulfillment?: string): number {
    const fee = parseInt(initialFee, 10);
    if (transactionType === TransactionTypes.payment && fee < DEFAULT_FEE_PRICE) {
      console.log(`Fee price is too low to perform the transaction; set by default to 12`);
      return DEFAULT_FEE_PRICE;
    } else if (transactionType === TransactionTypes.escrowExecution) {
      // compute the fee
      console.log(`Fee price depends on the sent data`);
      const fulfillmentLength = Buffer.from(fulfillment, "hex").length;
      const addedDrops = fulfillmentLength * 10 / 16;
      return BASE_ESCROW_EXECUTION_FEE_PRICE + Math.ceil(addedDrops);
    }
    return fee;
  }

  isValidISODateFormat(dateTime: string): boolean {
    const d = new Date(dateTime);
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(dateTime)) return false;
    return d.toISOString() === dateTime;
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
  atomicSwapParameters?: AtomicSwapOptions;
}

export type AtomicSwapOptions = AtomicSwapCreateOptions | AtomicSwapExecuteOptions | AtomicSwapCancelOptions;

export enum TransactionTypes {
  payment = "PAYMENT",
  escrowCreation = "ESCROW_CREATION",
  escrowExecution = "ESCROW_EXECUTION",
  escrowCancellation = "ESCROW_CANCELLATION"
}

interface AtomicSwapCreateOptions {
  allowCancelAfter?: string; //in ISOString format
  allowExecuteAfter?: string;
  condition?: string; //this is the sha256 hashOutput
}

interface AtomicSwapExecuteOptions {
  owner: string;
  escrowSequence: string;
  condition?: string;
}

interface AtomicSwapCancelOptions {
  owner: string;
  escrowSequence: string;
}

export default Ripple;
