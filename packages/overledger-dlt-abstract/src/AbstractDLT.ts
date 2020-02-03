import {TransactionRequest, SignedTransactionRequest, Account, TransactionTypeOptions, TransactionAccountsRequest , TransactionUtxoRequest} from '@quantnetwork/overledger-types';
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
   * Sign a transaction for the DLT
   *
   * @param {string} toAddress
   * @param {string} message
   */
  public sign(thisTransaction: TransactionRequest): Promise<string> {
    
    //input validation for the user account then a generic transaction
    if (!this.account) {
      throw new Error(`The ${this.name} account must be set up`);
    } else if (thisTransaction.dlt === null) {
      throw new Error(`All transactions must have a dlt field`);
    } else if (thisTransaction.type === null) {
      throw new Error(`All transactions must have a type field`);
    } else if (thisTransaction.subType === null) {
      throw new Error(`All transactions must have a subType field`);
    } else if ((thisTransaction.message === 'undefined')||(thisTransaction.message == null)) {
      throw new Error(`All transactions must have a message field. If no message is required, assign message to the empty string, i.e. message: ""`);
    }

    //now input validation on a generic accounts-based transaction or utxo-based transaction
    if (thisTransaction.type == TransactionTypeOptions.accounts){

      let thisAccountsTx = <TransactionAccountsRequest> thisTransaction;
      if ((thisAccountsTx.fromAddress == "")||(thisAccountsTx.fromAddress == null)||(thisAccountsTx.fromAddress === 'undefined')){
        throw new Error(`All transactions for accounts distributed ledgers must have the fromAddress field`);      
      } else if ((thisAccountsTx.toAddress == null)||(thisAccountsTx.toAddress === 'undefined')){
        throw new Error(`All transactions for accounts distributed ledgers must have the toAddress field. If you do not want to set a toAddress (maybe you are creating an on-chain smart contract?), assign toAddress to the empty string, i.e. toAddress = ""`);      
      } else if ((thisAccountsTx.sequence == null)){
        throw new Error(`All transactions for accounts distributed ledgers must have the sequence field as a number`);      
      }

    } else if (thisTransaction.type == TransactionTypeOptions.utxo){
      
      let thisUtxoTx = <TransactionUtxoRequest> thisTransaction;
      if (thisUtxoTx.txInputs == null){
        throw new Error(`All transactions for utxo distributed ledgers must have the txInputs field`);      
      } else if (thisUtxoTx.txOutputs == null){
        throw new Error(`All transactions for utxo distributed ledgers must have the txOutputs field`);      
      }
    }


    return this._sign(thisTransaction);
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
   * Allows a smart contract to be queried.
   * @param contractQueryDetails - The details on the query
   */
  abstract buildSmartContractQuery(contractQueryDetails: Object): Object;

  /**
   * Wrap a specific DLT signed transaction with the Overledger required fields
   *
   * @param {SignedTransactionRequest} signedTransaction
   *
   * @return {ApiCall}
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
