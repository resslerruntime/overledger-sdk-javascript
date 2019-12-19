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
      throw new Error(`The account's address must be a valid XRP address`)
    }
    this.account = account;
  }

  /**
   * Build the transaction
   *
   * @param {string} toAddress - who is the transaction being sent to
   * @param {string} message - what is the message associated to this transaction
   * @param {TransactionOptions} options - what additional transaction options are there
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
    console.log("options.amount:" + options.amount);

    if (parseFloat(options.amount) < 0.000001){
      throw new Error(`The amount must be at least 1 drop (i.e at least 0.000001)`);
    }

    if (typeof options.sequence === 'undefined') {
      throw new Error('options.sequence must be set up');
    }
    console.log("options.sequence:" + options.sequence);

    if (typeof options.maxLedgerVersion === 'undefined') {
      throw new Error('options.maxLedgerVersion must be set up');
    }
    console.log("options.maxLedgerVersion" + options.maxLedgerVersion);

    if (!(typeof options.sequence === 'number')) {
      throw new Error(`sequence must be a number`);
    }

    if (!this.isValidRippleAddress(toAddress)) { //this seemed to throw me errors
      throw new Error(`The toAddress must be a valid XRP address: ` + toAddress);
    }
    console.log("options.toAddress:" + toAddress);
    const maxLedgerVersion = Number(options.maxLedgerVersion);
    let fee;
    const amountInXRP = dropsToXrp(options.amount);
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
          console.log("paramsCreate: " + Object.keys(paramsCreate));
          let createCondition;
          if (paramsCreate.hashAlgorithmCondition !== ""){
            createCondition = paramsCreate.hashAlgorithmCondition;
            console.log("createCondition Output" + createCondition);
          } else {
            createCondition = this.computeEscrowConditionFulfillment(paramsCreate.hashAlgorithmInputString).escrowCondition;
          }
          console.log("amountInXRP:" + amountInXRP);
          console.log("paramsCreate.allowCancelAfter1:" + paramsCreate.allowCancelAfter);
          console.log("paramsCreate.allowExecuteAfter:" + paramsCreate.allowExecuteAfter);
          console.log("thisCondition1:" + createCondition);
          escrowCreation = {
            amount: amountInXRP,
            destination: toAddress,
            allowCancelAfter: paramsCreate.allowCancelAfter,
            allowExecuteAfter: paramsCreate.allowExecuteAfter,
            condition: createCondition,
            memos: [{
              data: message,
            }]
          }
          fee = this.computeFeePrice(options.feePrice, TransactionTypes.escrowCreation);
          console.log('escrowCreation', escrowCreation);
          break;
        case "ESCROW_EXECUTION":
          let paramsExecute = params as AtomicSwapExecuteOptions;
          let execCondition;
          let execFulfillment;
          if (paramsExecute.hashAlgorithmCondition !== "" && paramsExecute.hashAlgorithmFulfillment !== ""){
            execCondition = paramsExecute.hashAlgorithmCondition;
            execFulfillment = paramsExecute.hashAlgorithmFulfillment;
            console.log("execCondition Output " + execCondition);
            console.log("execFulfillment Output " + execFulfillment);
          } else {
            const conditionAndFulfillment = this.computeEscrowConditionFulfillment(paramsExecute.hashAlgorithmInputString);
            execCondition = conditionAndFulfillment.escrowCondition;
            execFulfillment = conditionAndFulfillment.escrowFulfillment;
          }
          escrowExecution = {
            owner: paramsExecute.owner,
            escrowSequence: parseInt(paramsExecute.escrowSequence),
            condition: execCondition,
            fulfillment: execFulfillment,
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
    console.log('feeInXRP', feeInXRP);
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
   * @param {string} toAddress - the receiver of the transaction
   * @param {string} message - the message embedded in the transaction
   * @param {TransactionOptions} options - any transaction options
   */
  async _sign(toAddress: string, message: string, options: TransactionOptions): Promise<string> {
    const swapOptions = options.atomicSwapParameters;

    try {
      const built = this.buildTransaction(toAddress, message, options);
      let prepared;
      console.log('transaction type', options.transactionType);
      switch (options.transactionType) {
        case 'PAYMENT':
          prepared = await this.rippleAPI.preparePayment(built.address, built.payment, built.instructions);
          break;
        case 'ESCROW_CREATION':
          this.validateSignArgs(options.transactionType, swapOptions);
          prepared = await this.rippleAPI.prepareEscrowCreation(built.address, built.escrowCreation, built.instructions);
          break;
        case 'ESCROW_EXECUTION':
          this.validateSignArgs(options.transactionType, swapOptions);
          prepared = await this.rippleAPI.prepareEscrowExecution(built.address, built.escrowExecution, built.instructions);
          break;
        case 'ESCROW_CANCELLATION':
          this.validateSignArgs(options.transactionType, swapOptions);
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

  /**
   * Takes a string hash algorith input and generates both the bytecode version of the condition to be placed on the ledger and also the bytecode version of its pre-image fulfillment 
   * @param hashAlgorithmInput 
   */
  computeEscrowConditionFulfillment(hashAlgorithmInput: string): { escrowCondition: string, escrowFulfillment: string } {
    const data = Buffer.from(hashAlgorithmInput, 'utf-8');
    const dataStr = data.toString('hex');
    const preImageDataStr = dataStr.padStart(64, '0');
    const preImageData = Buffer.from(preImageDataStr, 'hex');
    const myFulfillment = new cc.PreimageSha256();
    myFulfillment.setPreimage(preImageData);
    const escrowCondition = myFulfillment.getConditionBinary().toString('hex').toUpperCase();
    const escrowFulfillment = myFulfillment.serializeBinary().toString('hex').toUpperCase();
    return { escrowCondition, escrowFulfillment };
  }

  /**
   * 
   * @param address - the address to check
   */
  isValidRippleAddress(address: string): boolean {
    return isValidClassicAddress(address) || isValidXAddress(address);
  }

  /**
   * Check to see if valid parameters have been passed through 
   * @param transactionType - this transaction type
   * @param swapOptions - any options for the atomic swap
   */
  validateSignArgs(transactionType: TransactionTypes, swapOptions: AtomicSwapOptions): boolean {

    if (!transactionType || !(typeof transactionType === 'string') || (transactionType.length === 0)) {
      throw new Error(`The transactionType must be set from the enum TransactionTypes`);
    }
    if ((swapOptions as AtomicSwapCreateOptions).allowCancelAfter && !this.isValidISODateFormat((swapOptions as AtomicSwapCreateOptions).allowCancelAfter)) {
      throw new Error(`allowCancelAfter ${(swapOptions as AtomicSwapCreateOptions).allowCancelAfter} date format is not valid. ISO date format is required.`);
    }
    if ((swapOptions as AtomicSwapCreateOptions).allowExecuteAfter && !this.isValidISODateFormat((swapOptions as AtomicSwapCreateOptions).allowExecuteAfter)) {
      throw new Error(`allowExecuteAfter ${(swapOptions as AtomicSwapCreateOptions).allowCancelAfter} date format is not valid. ISO date format is required.`);
    }
    if ((swapOptions as AtomicSwapCreateOptions).allowExecuteAfter && !this.isValidDate((swapOptions as AtomicSwapCreateOptions).allowExecuteAfter, (swapOptions as AtomicSwapCreateOptions).allowCancelAfter)) {
      throw new Error(`allowExecuteAfter ${(swapOptions as AtomicSwapCreateOptions).allowCancelAfter} and allowCancelAfter ${(swapOptions as AtomicSwapCreateOptions).allowCancelAfter} need to be after the current date and allowExecuteAfter needs to be before allowCancelAfter`);
    }
    if ((swapOptions as AtomicSwapCreateOptions | AtomicSwapExecuteOptions).hashAlgorithmInputString && (((swapOptions as AtomicSwapCreateOptions | AtomicSwapExecuteOptions).hashAlgorithmInputString.length <= 0) || (typeof (swapOptions as AtomicSwapCreateOptions | AtomicSwapExecuteOptions).hashAlgorithmInputString !== 'string'))) {
      throw new Error(`condition must be a non null string`);
    }
    if (!(typeof parseInt((swapOptions as AtomicSwapExecuteOptions | AtomicSwapCancelOptions).escrowSequence, 10) === 'number')) {
      throw new Error(`escrowSequence must be an integer`);
    }
    if (((swapOptions as AtomicSwapExecuteOptions | AtomicSwapCancelOptions).owner) && !this.isValidRippleAddress((swapOptions as AtomicSwapExecuteOptions | AtomicSwapCancelOptions).owner)) {
      console.log(`owner`, (swapOptions as AtomicSwapExecuteOptions | AtomicSwapCancelOptions).owner);
      throw new Error(`the escrow owner address is not a valid XRP address`);
    }
    return true;
  }

  /**
   * 
   * @param initialFee 
   * @param transactionType - what type of transaction is this
   * @param fulfillment - is there an escrow fulfillment to be added to the transaction
   */
  computeFeePrice(initialFee: string, transactionType: TransactionTypes, fulfillment?: string): number {
    let fee;
    if (typeof initialFee === 'undefined') {
      fee = 0;
    } else {
      fee = parseInt(initialFee, 10);
    }
    if (transactionType === TransactionTypes.payment && (fee < DEFAULT_FEE_PRICE)) {
      console.log(`Fee price is too low to perform the transaction; set by default to 12`);
      return DEFAULT_FEE_PRICE;
    } else if (transactionType === TransactionTypes.escrowCreation && fee < DEFAULT_FEE_PRICE) {
      console.log(`Fee price is too low to perform the transaction; set by default to 12`);
      return DEFAULT_FEE_PRICE;
    } else if (transactionType === TransactionTypes.escrowCancellation && fee < DEFAULT_FEE_PRICE) {
      console.log(`Fee price is too low to perform the transaction; set by default to 12`);
      return DEFAULT_FEE_PRICE;
    } else if (transactionType === TransactionTypes.escrowExecution) {
      // compute the minimum fee
      console.log(`Fee price depends on the sent data to fulfil the escrow`);
      const fulfillmentLength = Buffer.from(fulfillment, "hex").length;
      const addedDrops = fulfillmentLength * 10 / 16;
      let minFee = BASE_ESCROW_EXECUTION_FEE_PRICE + Math.ceil(addedDrops);
      //return the largest fee (either the passed through one or this minimum fee)
      if (minFee > fee){
        return minFee;
      } else {
        return fee;
      }
    }
    return fee;
  }

  /**
   * Checking the given parameter passes the ISODate format
   * @param dateTime - the date to check
   */
  isValidISODateFormat(dateTime: string): boolean {
    const d = new Date(dateTime);
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(dateTime)) return false;
    return d.toISOString() === dateTime;
  }

    /**
   * Checking the given parameter passes the ISODate format
   * @param dateTimeCreate - the escrow creation time
   * @param dateTimeCancel - the escrow cancelation time
   */
  isValidDate(dateTimeCreate: string, dateTimeCancel: string): boolean {
    const createDate = new Date(dateTimeCreate);
    const cancelationDate = new Date(dateTimeCancel);
    const currentDate = new Date();
    if (createDate > cancelationDate){
      return false;
    } else if (currentDate > cancelationDate){ //execute date could be in the past but not cancelation date, otherwise there is no point
      return false;
    }
      return true;
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
  feePrice: string; //amount to pay in drops for adding the transaction to the XRP ledger. 1 drop = 0.000001 XRP
  sequence: number; //the sequence number of the sending account
  maxLedgerVersion: string; //The highest ledger version for the transaction to be confirmed into
  amount: string; //the amount to transfer to the receiving address in XRP.
  transactionType: TransactionTypes; //what type of XRP transaction is this?
  atomicSwapParameters?: AtomicSwapOptions; //If you have selected an escrow transaction then these parameters needed to be filled in
}

export type AtomicSwapOptions = AtomicSwapCreateOptions | AtomicSwapExecuteOptions | AtomicSwapCancelOptions;

export enum TransactionTypes {
  payment = "PAYMENT",  //simple XRP transfer between addresses
  escrowCreation = "ESCROW_CREATION",
  escrowExecution = "ESCROW_EXECUTION",
  escrowCancellation = "ESCROW_CANCELLATION"
}

/**
 * One of hashAlgorithmInput or hashAlgorithmOutput should be choosen depending on if you are starting the swap on this chain or another chain respectively
 */
interface AtomicSwapCreateOptions {
  allowCancelAfter: string; //from when can the escrow be executed? In ISOString format
  allowExecuteAfter: string; ////from when can the escrow be cancelled? In ISOString format
  hashAlgorithmInputString?: string; //this is the sha256 hash algorithm input as a string. It will NOT be placed on the ledger when creating a transaction. 
  hashAlgorithmCondition?: string; //this is if there has been a hash string placed onto another chain and now we want to add it to this chain.
}

interface AtomicSwapExecuteOptions {
  owner: string; //Who address of who created the escrow
  escrowSequence: string; //The sequence number of the escrow you are executing
  hashAlgorithmInputString?: string; //this is the sha256 hash algorithm input as a string. It will NOT be placed on the ledger when creating a transaction. 
  hashAlgorithmCondition?: string;
  hashAlgorithmFulfillment?: string;
}

interface AtomicSwapCancelOptions {
  owner: string; //Who address of who created the escrow
  escrowSequence: string;  //The sequence number of the escrow you are executing
}

export default Ripple;
