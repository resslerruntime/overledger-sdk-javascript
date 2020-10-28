import { RippleAPI } from 'ripple-lib';
import { dropsToXrp } from 'ripple-lib/dist/npm/common';
import { deriveKeypair, deriveAddress } from 'ripple-keypairs';
import AbstractDLT from '@quantnetwork/overledger-dlt-abstract';
import { Account, Options, TransactionRequest, ValidationCheck } from '@quantnetwork/overledger-types';
import TransactionXRPRequest from './DLTSpecificTypes/TransactionXRPRequest';
import TransactionXRPSubTypeOptions from './DLTSpecificTypes/associatedEnums/TransactionXRPSubTypeOptions';
import TrustLineXRPOptions from './DLTSpecificTypes/TrustlineXRPParams';
import { Payment } from 'ripple-lib/dist/npm/transaction/payment';
import { Instructions } from 'ripple-lib/dist/npm/transaction/types';
import { EscrowCreation } from 'ripple-lib/dist/npm/transaction/escrow-creation';
import { EscrowExecution } from 'ripple-lib/dist/npm/transaction/escrow-execution';
import { EscrowCancellation } from 'ripple-lib/dist/npm/transaction/escrow-cancellation';
import * as cc from 'five-bells-condition';
import { isValidClassicAddress, isValidXAddress } from 'ripple-address-codec';
import { FormattedTrustlineSpecification } from 'ripple-lib/dist/npm/common/types/objects';


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
   * Create an XRP account
   *
   * @return {Account} (privateKey, address)
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
   * Takes the Overledger definition of a transaction and converts it into a specific XRP transaction
   * @param {TransactionXRPRequest} thisTransaction - details on the information to include in this transaction for the XRP distributed ledger
   * @return {Transaction} the XRP transaction
   */
  buildTransaction(thisTransaction: TransactionXRPRequest): Transaction {

    super.transactionValidation(thisTransaction);

    let payment;
    let escrowCreation: EscrowCreation;
    let escrowExecution: EscrowExecution;
    let escrowCancellation: EscrowCancellation;
    let trustLine: FormattedTrustlineSpecification;
    let toReturn = {
      xrpObject: {},
      instructions: {},
      address: "",
    };
    const maxLedgerVersion = Number(thisTransaction.extraFields.maxLedgerVersion);
    const address = this.account.address;
    let fee;
    const currency = thisTransaction.extraFields.currency ? thisTransaction.extraFields.currency : 'XRP';
    const amountInXRP = currency === 'XRP' ? dropsToXrp(thisTransaction.amount.toString()) : thisTransaction.amount.toString();

    if (thisTransaction.subType.name === TransactionXRPSubTypeOptions.VALUE_TRANSFER) {
      const issuer = currency !== 'XRP' ? address : undefined;
      fee = this.computeFeePrice(thisTransaction.extraFields.feePrice, thisTransaction.subType.name);
      payment = {
        source: {
          address,
          maxAmount: {
            value: amountInXRP,
            currency,
            counterparty: issuer
          },
        },
        destination: {
          address: thisTransaction.toAddress,
          amount: {
            value: amountInXRP,
            currency,
            counterparty: issuer
          },
        },
        memos: [{
          data: thisTransaction.message,
        }],
      };
      toReturn.xrpObject = payment;
    } else if (thisTransaction.subType.name === TransactionXRPSubTypeOptions.ESCROW_CREATE) {
      const params = thisTransaction.extraFields.atomicSwapParameters;
          let paramsCreate = params as AtomicSwapCreateOptions;
          let createCondition;
          if (typeof paramsCreate.hashAlgorithmCondition !== 'undefined'){
            createCondition = paramsCreate.hashAlgorithmCondition;
            console.log("createCondition0: " + createCondition); 
          } else {
            //createCondition = this.computeEscrowConditionFulfillment(paramsCreate.hashAlgorithmInputString).escrowCondition;
            const conditionAndFulfillment = this.computeEscrowConditionFulfillment(paramsCreate.hashAlgorithmInputString);
            createCondition = conditionAndFulfillment.escrowCondition;
            const execFulfillment = conditionAndFulfillment.escrowFulfillment;  
            console.log("paramsCreate.hashAlgorithmInputString: " + paramsCreate.hashAlgorithmInputString);             
            console.log("createCondition1: " + createCondition);   
            console.log("execFulfillment1: " + execFulfillment);      
          }
          escrowCreation = {
            amount: amountInXRP,
            destination: thisTransaction.toAddress,
            allowCancelAfter: paramsCreate.allowCancelAfter,
            allowExecuteAfter: paramsCreate.allowExecuteAfter,
            condition: createCondition,
            memos: [{
              data: thisTransaction.message,
            }]
          }
          fee = this.computeFeePrice(thisTransaction.extraFields.feePrice, thisTransaction.subType.name);
          toReturn.xrpObject = escrowCreation;
        } else if (thisTransaction.subType.name === TransactionXRPSubTypeOptions.ESCROW_CLAIM) {
          const params = thisTransaction.extraFields.atomicSwapParameters;
          let paramsExecute = params as AtomicSwapExecuteOptions;
          let execCondition;
          let execFulfillment;
          if (typeof paramsExecute.hashAlgorithmCondition !== 'undefined' && typeof paramsExecute.hashAlgorithmFulfillment !== 'undefined'){
            execCondition = paramsExecute.hashAlgorithmCondition;
            execFulfillment = paramsExecute.hashAlgorithmFulfillment;
          } else {
            const conditionAndFulfillment = this.computeEscrowConditionFulfillment(paramsExecute.hashAlgorithmInputString);
            execCondition = conditionAndFulfillment.escrowCondition;
            execFulfillment = conditionAndFulfillment.escrowFulfillment;
            console.log("paramsExecute..hashAlgorithmInputString: " + paramsExecute.hashAlgorithmInputString);             
            console.log("execCondition2: " + execCondition);   
            console.log("execFulfillment2: " + execFulfillment); 
          }
          escrowExecution = {
            owner: paramsExecute.owner,
            escrowSequence: parseInt(paramsExecute.escrowSequence),
            condition: execCondition,
            fulfillment: execFulfillment,
            memos: [{
              data: thisTransaction.message,
            }]
          }
          fee = this.computeFeePrice(thisTransaction.extraFields.feePrice, thisTransaction.subType.name, escrowExecution.fulfillment!);
          toReturn.xrpObject = escrowExecution;
        } else if (thisTransaction.subType.name === TransactionXRPSubTypeOptions.ESCROW_CANCEL) {
          const params = thisTransaction.extraFields.atomicSwapParameters;
          let paramsCancel = params as AtomicSwapCancelOptions;
          escrowCancellation = {
            owner: paramsCancel.owner,
            escrowSequence: parseInt(paramsCancel.escrowSequence),
            memos: [{
              data: thisTransaction.message,
            }]
          }
          fee = this.computeFeePrice(thisTransaction.extraFields.feePrice, thisTransaction.subType.name);
          toReturn.xrpObject = escrowCancellation;
      }  else if (thisTransaction.subType.name === TransactionXRPSubTypeOptions.TRUSTLINE_CREATE){
        const params = thisTransaction.extraFields.trustlineParameters;
        fee = this.computeFeePrice(thisTransaction.extraFields.feePrice, TransactionXRPSubTypeOptions.VALUE_TRANSFER);
        trustLine = {
          currency: thisTransaction.extraFields.currency,
          counterparty: thisTransaction.toAddress,
          limit: params.maxCredit,
          authorized: params.authorized,
          frozen: params.frozen,
          ripplingDisabled: params.ripplingDisabled,
          memos: [{
            data: thisTransaction.message,
          }]
        };
        toReturn.xrpObject = trustLine;
      }
    
    const feeInXRP = dropsToXrp(fee.toString());
    const instructions = {
      maxLedgerVersion,
      sequence: thisTransaction.sequence,
      fee: feeInXRP,
    };

    toReturn.address = address;
    toReturn.instructions = instructions;

    return toReturn;
  }

  /**
   * validates an OVL transactionRequest according to XRP specific rules
   * @param thisTransaction - The transaction request
   */
  _transactionValidation(thisTransaction: TransactionRequest): ValidationCheck {
    const thisXRPTx = <TransactionXRPRequest>thisTransaction;
    // check for the presence of XRP specific fields
    if (!Object.values(TransactionXRPSubTypeOptions).includes(thisXRPTx.subType.name)) {
      return {
        success: false,
        failingField: 'subType',
        error: 'You must select a subType from TransactionSubTypeOptions',
      };
    }
    if ((!thisXRPTx.extraFields) || (thisXRPTx.extraFields === null)) {
      return {
        success: false,
        failingField: 'extraFields',
        error: 'All transactions for XRP must have the extraFields field set with feePrice and maxLedgerVersion parameters within it',
      };
    }
    if ((thisXRPTx.extraFields.feePrice === '') || (thisXRPTx.extraFields.feePrice === null) || (typeof thisXRPTx.extraFields.feePrice === 'undefined')) {
      return {
        success: false,
        failingField: 'extraFields.feePrice',
        error: 'All transactions for XRP must have the extraFields.feePrice field set',
      };
    }
    if ((thisXRPTx.extraFields.maxLedgerVersion === '') || (thisXRPTx.extraFields.maxLedgerVersion === null) || (typeof thisXRPTx.extraFields.maxLedgerVersion === 'undefined')) {
      return {
        success: false,
        failingField: 'extraFields.maxLedgerVersion',
        error: 'All transactions for XRP must have the extraFields.maxLedgerVersion field set',
      };
    }

    // there must be a to address
    if (thisXRPTx.toAddress === '') {
      return {
        success: false,
        failingField: 'toAddress',
        error: 'All transactions for XRP must have the toAddress field set to an address',
      };
    }
    // sequence number must start at 1
    if (thisXRPTx.sequence <= 0) {
      return {
        success: false,
        failingField: 'sequence',
        error: 'All transactions for XRP must have a sequence number greater than 0',
      };
    }

    if ((typeof thisXRPTx.amount === 'undefined') || (thisXRPTx.amount <= 0)) {
      return {
        success: false,
        failingField: 'amount',
        error: 'A transactions for XRP must have an amount > 0',
      };
    }

    if((typeof thisXRPTx.extraFields.currency !== 'undefined')&&(!this.isValidCurrency(thisXRPTx.extraFields.currency))){
      return {
        success: false,
        failingField: 'extraFields.currency',
        error: 'A format of the currency is not correct',
      };    
    }

    if (!this.isValidRippleAddress(thisXRPTx.fromAddress)) {
      return {
        success: false,
        failingField: 'fromAddress',
        error: 'the from address is in the incorrect format',
      };
    }

    if (!this.isValidRippleAddress(thisXRPTx.toAddress)) {
      return {
        success: false,
        failingField: 'toAddress',
        error: 'the to address is in the incorrect format',
      };
    }

    //if escrow create
    if (thisXRPTx.subType.name === TransactionXRPSubTypeOptions.ESCROW_CREATE){

      if ((thisXRPTx.extraFields.atomicSwapParameters === null) || (typeof thisXRPTx.extraFields.atomicSwapParameters === 'undefined')) {
        return {
          success: false,
          failingField: 'extraFields.atomicSwapParameters',
          error: 'All escrow creation transactions for XRP must have atomicSwapParameters',
        };
      } 
      let params = <AtomicSwapCreateOptions> thisXRPTx.extraFields.atomicSwapParameters;
      if ((params.allowCancelAfter === '') || (params.allowCancelAfter === null) || (typeof params.allowCancelAfter === 'undefined')) {
        return {
          success: false,
          failingField: 'extraFields.atomicSwapParameters.allowCancelAfter',
          error: 'All escrow creation transactions for XRP must have an allowCancelAfter field',
        };
      } else if ((params.allowExecuteAfter === '') || (params.allowExecuteAfter === null) || (typeof params.allowExecuteAfter === 'undefined')) {
        return {
          success: false,
          failingField: 'extraFields.atomicSwapParameters.allowExecuteAfter',
          error: 'All escrow creation transactions for XRP must have an allowExecuteAfter field',
        };
      } else if (!this.isValidISODateFormat(params.allowCancelAfter)) {
        return {
          success: false,
          failingField: 'extraFields.atomicSwapParameters.allowCancelAfter',
          error: 'All escrow creation transactions for XRP must have an allowCancelAfter field in ISODateFormat',
        };
      } else if (!this.isValidISODateFormat(params.allowExecuteAfter)) {
        return {
          success: false,
          failingField: 'extraFields.atomicSwapParameters.allowExecuteAfter',
          error: 'All escrow creation transactions for XRP must have an allowExecuteAfter in ISODateFormat',
        };
      }  else if (!this.isValidDate(params.allowExecuteAfter, params.allowCancelAfter)) {
        return {
          success: false,
          failingField: 'extraFields.atomicSwapParameters.allowExecuteAfter  and allowCancelAfter',
          error: 'Both allowCancelAfter and allowExecuteAfter need to be after the current date and allowExecuteAfter needs to be before allowCancelAfter',
        };
      } else if ((params.allowExecuteAfter === '') || (params.allowExecuteAfter === null) || (typeof params.allowExecuteAfter === 'undefined')) {
        return {
          success: false,
          failingField: 'extraFields.atomicSwapParameters.allowExecuteAfter',
          error: 'All escrow creation transactions for XRP must have an allowExecuteAfter field',
        };
      } else if (params.hashAlgorithmInputString && ((params.hashAlgorithmInputString.length <= 0) || (typeof params.hashAlgorithmInputString !== 'string'))) {
        return {
          success: false,
          failingField: 'extraFields.atomicSwapParameters.hashAlgorithmInputString',
          error: 'If provided, then hashAlgorithmInputString must be a non null string',
        };
      } else if (params.hashAlgorithmCondition && ((params.hashAlgorithmCondition.length <= 0) || (typeof params.hashAlgorithmCondition !== 'string'))) {
        return {
          success: false,
          failingField: 'extraFields.atomicSwapParameters.hashAlgorithmCondition',
          error: 'If provided, then hashAlgorithmCondition must be a non null string',
        };
      }  else if (params.hashAlgorithmInputString && params.hashAlgorithmCondition) {
        return {
          success: false,
          failingField: 'extraFields.atomicSwapParameters.hashAlgorithmCondition and hashAlgorithmInputString',
          error: 'One of hashAlgorithmInputString or hashAlgorithmCondition needs to be provided',
        };
      }

    } else if (thisXRPTx.subType.name === TransactionXRPSubTypeOptions.ESCROW_CLAIM){
    //if escrow claim
      if ((thisXRPTx.extraFields.atomicSwapParameters === null) || (typeof thisXRPTx.extraFields.atomicSwapParameters === 'undefined')) {
        return {
          success: false,
          failingField: 'extraFields.atomicSwapParameters',
          error: 'All escrow execution transactions for XRP must have atomicSwapParameters',
        };
      } 
      let params = <AtomicSwapExecuteOptions> thisXRPTx.extraFields.atomicSwapParameters;
      if (params.hashAlgorithmInputString && ((params.hashAlgorithmInputString.length <= 0) || (typeof params.hashAlgorithmInputString !== 'string'))) {
        return {
          success: false,
          failingField: 'extraFields.atomicSwapParameters.hashAlgorithmInputString',
          error: 'If provided, then hashAlgorithmInputString must be a non null string',
        };
      } else if (params.hashAlgorithmCondition && ((params.hashAlgorithmCondition.length <= 0) || (typeof params.hashAlgorithmCondition !== 'string'))) {
        return {
          success: false,
          failingField: 'extraFields.atomicSwapParameters.hashAlgorithmCondition',
          error: 'If provided, then hashAlgorithmCondition must be a non null string',
        };
      }  else if ((params.escrowSequence === '') || (params.escrowSequence === null) || (typeof params.escrowSequence === 'undefined')) {
        return {
          success: false,
          failingField: 'extraFields.atomicSwapParameters.escrowSequence',
          error: 'All escrow execution transactions for XRP must have an escrowSequence field',
        };
      }  else if (!(typeof parseInt(params.escrowSequence, 10) === 'number')) {
        return {
          success: false,
          failingField: 'extraFields.atomicSwapParameters.escrowSequence',
          error: 'The escrowSequence parameter must be an integer',
        };
      } else if ((params.owner === '') || (params.owner === null) || (typeof params.owner === 'undefined')) {
        return {
          success: false,
          failingField: 'extraFields.atomicSwapParameters.owner',
          error: 'All escrow execution transactions for XRP must have an owner field',
        };
      } else if (!this.isValidRippleAddress(params.owner)) {
        return {
          success: false,
          failingField: 'extraFields.atomicSwapParameters.owner',
          error: 'the owner address is in the incorrect format',
        };
      }

    } else if (thisXRPTx.subType.name === TransactionXRPSubTypeOptions.ESCROW_CANCEL){
      //if escrow cancel
        if ((thisXRPTx.extraFields.atomicSwapParameters === null) || (typeof thisXRPTx.extraFields.atomicSwapParameters === 'undefined')) {
          return {
            success: false,
            failingField: 'extraFields.atomicSwapParameters',
            error: 'All escrow execution transactions for XRP must have atomicSwapParameters',
          };
        } 
        let params = <AtomicSwapCancelOptions> thisXRPTx.extraFields.atomicSwapParameters;
     if ((params.escrowSequence === '') || (params.escrowSequence === null) || (typeof params.escrowSequence === 'undefined')) {
          return {
            success: false,
            failingField: 'extraFields.atomicSwapParameters.escrowSequence',
            error: 'All escrow cancel transactions for XRP must have an escrowSequence field',
          };
        }  else if (!(typeof parseInt(params.escrowSequence, 10) === 'number')) {
          return {
            success: false,
            failingField: 'extraFields.atomicSwapParameters.escrowSequence',
            error: 'The escrowSequence parameter must be an integer',
          };
        }  else if ((params.owner === '') || (params.owner === null) || (typeof params.owner === 'undefined')) {
          return {
            success: false,
            failingField: 'extraFields.atomicSwapParameters.owner',
            error: 'All escrow cancel transactions for XRP must have an owner field',
          };
        }  else if (!this.isValidRippleAddress(params.owner)) {
          return {
            success: false,
            failingField: 'extraFields.atomicSwapParameters.owner',
            error: 'the owner address is in the incorrect format',
          };
        }
  
      } else if (thisXRPTx.subType.name === TransactionXRPSubTypeOptions.TRUSTLINE_CREATE){
        //if escrow claim
          if ((thisXRPTx.extraFields.trustlineParameters === null) || (typeof thisXRPTx.extraFields.trustlineParameters === 'undefined')) {
            return {
              success: false,
              failingField: 'extraFields.trustlineParameters',
              error: 'All escrow execution transactions for XRP must have trustlineParameters',
            };
          } 
          let params = <TrustLineXRPOptions> thisXRPTx.extraFields.trustlineParameters;
          if (params.maxCredit && ((params.maxCredit.length <= 0) || (typeof params.maxCredit !== 'string'))) {
            return {
              success: false,
              failingField: 'extraFields.atomicSwapParameters.maxCredit',
              error: 'The maxCredit parameter must be a non null string',
            };
          }
    
        } 


    return { success: true };
  }

  /**
   * Takes in an overledger definition of a transaction for XRP, converts it into a form that the XRP distributed ledger will understand, and then signs the transaction
   * @param {TransactionRequest} thisTransaction - an instantiated overledger definition of an XRP transaction
   */
  _sign(thisTransaction: TransactionRequest): Promise<string> {

    const built = this.buildTransaction(<TransactionXRPRequest>thisTransaction);

    const xrpTxRequest = <TransactionXRPRequest>thisTransaction;

      try {
        switch (xrpTxRequest.subType.name) {
          case TransactionXRPSubTypeOptions.VALUE_TRANSFER:
            return this.rippleAPI.preparePayment(built.address, <Payment>built.xrpObject, built.instructions)
            .then(
              prepared => this.rippleAPI.sign(prepared.txJSON, this.account.privateKey).signedTransaction,
            );
          case TransactionXRPSubTypeOptions.ESCROW_CREATE:
            return this.rippleAPI.prepareEscrowCreation(built.address, <EscrowCreation>built.xrpObject, built.instructions)
            .then(
              prepared => this.rippleAPI.sign(prepared.txJSON, this.account.privateKey).signedTransaction,
            );
          case TransactionXRPSubTypeOptions.ESCROW_CLAIM:
            return this.rippleAPI.prepareEscrowExecution(built.address, <EscrowExecution>built.xrpObject, built.instructions)
            .then(
              prepared => this.rippleAPI.sign(prepared.txJSON, this.account.privateKey).signedTransaction,
            );
          case TransactionXRPSubTypeOptions.ESCROW_CANCEL:
            return this.rippleAPI.prepareEscrowCancellation(built.address, <EscrowCancellation>built.xrpObject, built.instructions)
            .then(
              prepared => this.rippleAPI.sign(prepared.txJSON, this.account.privateKey).signedTransaction,
            );
          case TransactionXRPSubTypeOptions.TRUSTLINE_CREATE:
            return this.rippleAPI.prepareTrustline(built.address, <FormattedTrustlineSpecification>built.xrpObject, built.instructions)
            .then(
              prepared => this.rippleAPI.sign(prepared.txJSON, this.account.privateKey).signedTransaction,
            );
          default:
            return this.rippleAPI.preparePayment(built.address, <Payment>built.xrpObject, built.instructions)
            .then(
              prepared => this.rippleAPI.sign(prepared.txJSON, this.account.privateKey).signedTransaction,
            );
        }  
      } catch (e) {
        console.error(`Error while sending a ripple transaction`, e);
      }

  }

  /**
   * Allows a user to build a smart contract query for the XRP distributed ledger (currently not supported for XRP)
   * @param {string} dltAddress - the user's XRP address
   * @param {Object} contractQueryDetails - the definition of the smart contract function the user wants to interact with, including information on what parameters to use in the function call.
   *
   * @return {Object} success indicates if this query building was correct, if yes then it will be in the response field of the object
   */
  _buildSmartContractQuery(dltAddress: string, contractQueryDetails: Object): ValidationCheck {

    return {
      success: false,
      failingField: `${dltAddress} ${JSON.stringify(contractQueryDetails)}`,
      error: 'The XRP SDK does not currently support smart contract queries',
    };
  }

  /**
   * validates an OVL smart contract query according to XRP specific rules
   * @param contractQueryDetails - the query details
   *
   * @return {Object} success indicates if this query building was correct, if yes then it will be in the response field of the object
   */
  _smartContractQueryValidation(contractQueryDetails: Object): ValidationCheck {
    return {
      success: false,
      failingField: JSON.stringify(contractQueryDetails),
      error: 'The XRP SDK does not currently support smart contract validation',
    };
  }

    /**
   * 
   * @param initialFee 
   * @param transactionType - what type of transaction is this
   * @param fulfillment - is there an escrow fulfillment to be added to the transaction
   */
  computeFeePrice(initialFee: string, transactionType: TransactionXRPSubTypeOptions, fulfillment?: string): number {
    let fee;
    if (typeof initialFee === 'undefined') {
      fee = 0;
    } else {
      fee = parseInt(initialFee, 10);
    }
    if (transactionType === TransactionXRPSubTypeOptions.VALUE_TRANSFER && (fee < DEFAULT_FEE_PRICE)) {
      console.log(`Fee price is too low to perform the transaction; set by default to 12`);
      return DEFAULT_FEE_PRICE;
    } else if (transactionType === TransactionXRPSubTypeOptions.ESCROW_CREATE && fee < DEFAULT_FEE_PRICE) {
      console.log(`Fee price is too low to perform the transaction; set by default to 12`);
      return DEFAULT_FEE_PRICE;
    } else if (transactionType === TransactionXRPSubTypeOptions.ESCROW_CANCEL && fee < DEFAULT_FEE_PRICE) {
      console.log(`Fee price is too low to perform the transaction; set by default to 12`);
      return DEFAULT_FEE_PRICE;
    } else if (transactionType === TransactionXRPSubTypeOptions.ESCROW_CLAIM) {
      // compute the minimum fee
      console.log(`Fee price depends on the sent data to fulfill the escrow`);
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
   * Takes a string hash algorith input and generates both the bytecode version of the condition to be placed on the ledger and also the bytecode version of its pre-image fulfillment 
   * @param hashAlgorithmInput 
   */
  computeEscrowConditionFulfillment(hashAlgorithmInput: string): { escrowCondition: string, escrowFulfillment: string } {
    const data = Buffer.from(hashAlgorithmInput, 'utf-8');
    console.log("data: " +  data);
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

  isValidCurrency(currency: string): boolean {
    console.log(`currency ${currency}`);
    return (/^([0-9A-Za-z]{3})$/.test(currency));
  }

  /**
   * 
   * @param address - the address to check
   */
  isValidRippleAddress(address: string): boolean {
    return isValidClassicAddress(address) || isValidXAddress(address);
  }


}

interface AtomicSwapCreateOptions {
  allowCancelAfter: string; 
  allowExecuteAfter: string;
  hashAlgorithmInputString?: string; 
  hashAlgorithmCondition?: string;
}

interface AtomicSwapExecuteOptions {
  owner: string;
  escrowSequence: string; //
  hashAlgorithmInputString?: string; 
  hashAlgorithmCondition?: string;
  hashAlgorithmFulfillment?: string;
}

interface AtomicSwapCancelOptions {
  owner: string;
  escrowSequence: string; 
}

export type Transaction = {
  address: string,
  instructions?: Instructions,
  xrpObject: object,
};


export default Ripple;
