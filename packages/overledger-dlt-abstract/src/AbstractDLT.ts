import {TransactionRequest, SignedTransactionRequest, Account, TransactionTypeOptions, TransactionAccountsRequest , TransactionUtxoRequest, TransactionValidationCheck, TransactionInput, TransactionOutput} from '@quantnetwork/overledger-types';
import { AxiosPromise, AxiosResponse } from 'axios';

/**
 * @memberof module:overledger-dlt-abstract
*/
abstract class AbstractDLT {
  name: string;
  sdk: any;
  options: Object;

  account?: Account;

  /**
   * @param {any} sdk
   * @param {Object} options
   */
  constructor(sdk: any, options: Object = {}) {
    this.sdk = sdk;
    this.options = options;
  }

  /**
   * Create an account for a specific DLT
   *
   * @return {Account}
   */
  abstract createAccount(): Account;

  /**
   * Set an account for signing transactions for a specific DLT
   *
   * @param {string} privateKey The privateKey
   */
  abstract setAccount(privateKey: string): void;

  /**
   * Get the balance for a specific address
   *
   * @param {string} address The address to query for
   */
  public getBalance(address: string = null): Promise<AxiosResponse> {
    if (address === null) {
      if (!this.account) {
        throw new Error('The account must be set up');
      }

      address = this.account.address;
    }

    return this.sdk.request.get(`/balances/${this.name}/${address}`);
  }

  /**
   * Get the sequence for a specific address
   *
   * @param {string|string[]} address
   */
  public getSequence(address: string): AxiosPromise<Object> {
    return this.sdk.getSequences([{ address, dlt: this.name }]);
  }

  /**
   * Converts an Overledger transaction to the correct format for the DLT in question and signs it
   *
   * @param {TransactionRequest} thisTransaction - the transaction information
   */
  public sign(thisTransaction: TransactionRequest): Promise<string> {
    
    let transactionValidation = this.transactionValidation(thisTransaction);
    if (transactionValidation.success == false){
      throw new Error("Error parameter: " + transactionValidation.failingField + ". Error is: " + transactionValidation.error);
    }
    return this._sign(thisTransaction);
  }

  /**
   * Takes the given transaction and validates it
   * @param thisTransaction - the transaction to check the formatting of
   * 
   * @return {Object} - returns an object {success: boolean, failingField: string, error: string}.
   *  If 'success' = true, the validation passes, otherwise, the 'failingField' parameter will contain
   *  the first failing transaction field and error will contain information on this problem
   */
  public transactionValidation(thisTransaction: TransactionRequest): TransactionValidationCheck {
        //input validation for the user account 
        if (!this.account) {
          return {
            success: false,
            failingField: "overledger account",
            error: `The ${this.name} account must be set up`
          }
        }
        //now input validation for a generic transaction
       if ((!thisTransaction.dlt)||(thisTransaction.dlt === null)) {
          return {
            success: false,
            failingField: "dlt",
            error: "All transactions must have a dlt field"
          }
        } else if ((!thisTransaction.type)||(thisTransaction.type === null)){
          return {
            success: false,
            failingField: "type",
            error: "All transactions must have a type field"
          }
        } else if ((!thisTransaction.subType)||(thisTransaction.subType === null)) {
          return {
            success: false,
            failingField: "subType",
            error: "All transactions must have a subType field"
          }
        } else if ((!this.conversionTest(thisTransaction.message))||(thisTransaction.message === 'undefined')||(thisTransaction.message == null)) {
          return {
            success: false,
            failingField: "message",
            error: 'All transactions must have a message field. If no message is required, assign message to the empty string, i.e. message: ""'
          }
        }
    
        //now input validation on a generic accounts-based transaction or utxo-based transaction
        if (thisTransaction.type == TransactionTypeOptions.accounts){
    
          let thisAccountsTx = <TransactionAccountsRequest> thisTransaction;
          if ((!thisAccountsTx.fromAddress)||(thisAccountsTx.fromAddress == "")||(thisAccountsTx.fromAddress == null)||(thisAccountsTx.fromAddress === 'undefined')){
            return {
              success: false,
              failingField: "fromAddress",
              error: 'All transactions for accounts distributed ledgers must have the fromAddress field'
            }      
          } else if ((!this.conversionTest(thisAccountsTx.toAddress))||(thisAccountsTx.toAddress == null)||(thisAccountsTx.toAddress === 'undefined')){
            return {
              success: false,
              failingField: "toAddress",
              error: 'All transactions for accounts distributed ledgers must have the toAddress field. If you do not want to set a toAddress (maybe you are creating an on-chain smart contract?), assign toAddress to the empty string, i.e. toAddress = ""'
            }   
          } else if ((!this.conversionTest(thisAccountsTx.sequence))||(thisAccountsTx.sequence == null)||(thisAccountsTx.sequence < 0)){      
            return {
              success: false,
              failingField: "sequence",
              error: 'All transactions for accounts distributed ledgers must have the sequence field as a number greater or equal to 0'
            } 
          }
    
        } else if (thisTransaction.type == TransactionTypeOptions.utxo){
          
          let thisUtxoTx = <TransactionUtxoRequest> thisTransaction;
          if ((!this.conversionTest(thisUtxoTx.txInputs))||(thisUtxoTx.txInputs == null)){
            return {
              success: false,
              failingField: "txInputs",
              error: 'All transactions for utxo distributed ledgers must have the txInputs field'
            }       
          } else if ((!this.conversionTest(thisUtxoTx.txOutputs))||(thisUtxoTx.txOutputs == null)){
            return {
              success: false,
              failingField: "txOutputs",
              error: 'All transactions for utxo distributed ledgers must have the txOutputs field'
            }       
          }
          //check each input
          let counter = 0;
          let inputToValidate;
          while (counter < thisUtxoTx.txInputs.length){
            inputToValidate = <TransactionInput> thisUtxoTx.txInputs[counter];
            if ((!this.conversionTest(inputToValidate.linkedTx))||(inputToValidate.linkedTx == null)||(inputToValidate.linkedTx === 'undefined')){
              return {
                success: false,
                failingField: "txInputs.linkedTx",
                error: 'Each txInput for a utxo distributed ledger transaction must have a linkedTx field. If there is no linked transaction, set to the empty string, i.e.: linkedTx = ""'
              }       
            } else if ((!this.conversionTest(inputToValidate.linkedIndex))||(inputToValidate.linkedIndex == null)||(inputToValidate.linkedIndex === 'undefined')){
              return {
                success: false,
                failingField: "txInputs.linkedIndex",
                error: 'Each txInput for a utxo distributed ledger transaction must have a linkedIndex field. If there is no linked transaction index, set to the empty string, i.e.: linkedIndex = ""'
              }       
            }  else if ((!this.conversionTest(inputToValidate.fromAddress))||(inputToValidate.fromAddress == null)||(inputToValidate.fromAddress === 'undefined')){
              return {
                success: false,
                failingField: "txInputs.fromAddress",
                error: 'Each txInput for a utxo distributed ledger transaction must have a fromAddress field. If there is no from address (e.g. for coinbase transactions), set to the empty string, i.e.: fromAddress = ""'
              }       
            }
            counter++;
          }
          //check each output
          counter = 0;
          let outputToValidate;
          while (counter < thisUtxoTx.txOutputs.length){
            outputToValidate = <TransactionOutput> thisUtxoTx.txOutputs[counter];
            if ((!this.conversionTest(outputToValidate.toAddress))||(outputToValidate.toAddress == null)||(outputToValidate.toAddress === 'undefined')){
              return {
                success: false,
                failingField: "txInputs.toAddress",
                error: 'Each txOutput for a utxo distributed ledger transaction must have a toAddress field.'
              }       
            }
            counter++;
          }
        }

        //finally input validation on the distributed ledger specific transaction
        return this._transactionValidation(thisTransaction);
  }

  private conversionTest(thisObject: Object): boolean {
    try{
      thisObject.toString();
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * Send an Overledger signed transaction
   *
   * @param {SignedTransactionRequest} signedTransaction
   */
  public send(signedTransaction: SignedTransactionRequest): AxiosPromise<Object> {
    return this.sdk.send([this.buildSignedTransactionsApiCall(signedTransaction)]);
  }

   /**
    * Internal method to sign a transaction for the DLT
    * @param thisTransaction 
    */
  abstract _sign(thisTransaction: TransactionRequest): Promise<string>;

     /**
    * Internal method to validate a transaction for the DLT
    * @param thisTransaction 
    */
   abstract _transactionValidation(thisTransaction: TransactionRequest): TransactionValidationCheck;


  /**
   * Allows a smart contract to be queried.
   * @param contractQueryDetails - The details on the query
   */
  abstract buildSmartContractQuery(dltAddress: string, contractQueryDetails: Object): Object;

  /**
   * Wrap a specific DLT signed transaction with the Overledger required fields
   *
   * @param {SignedTransactionRequest} signedTransaction
   *
   * @return {SignedTransactionRequest}
   */
  public buildSignedTransactionsApiCall(stx: SignedTransactionRequest): SignedTransactionRequest {
    return {
      dlt: stx.dlt,
      fromAddress: stx.fromAddress,
      //amount: stx.amount,
      signedTransaction: stx.signedTransaction,
    };
  }
}


export default AbstractDLT;
