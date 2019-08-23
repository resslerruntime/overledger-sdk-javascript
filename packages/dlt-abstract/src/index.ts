import { TransactionOptions, SignedTransactionRequest, Account } from '@overledger/types';
import { AxiosPromise, AxiosResponse } from 'axios';

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
   * Sign a transaction for the DLT
   *
   * @param {string} toAddress
   * @param {string} message
   * @param {TransactionOptions} options
   */
  public sign(toAddress: string, message: string, options: TransactionOptions = {}): Promise<string> {
    if (!this.account) {
      throw new Error(`The ${this.name} account must be set up`);
    }

    return this._sign(toAddress, message, options);
  }

  /**
   * Internal method to sign a transaction for the DLT
   *
   * @param {string} toAddress
   * @param {string} message
   * @param {Object} options
   */
  abstract _sign(toAddress: string, message: string, options?: TransactionOptions): Promise<string>;

  /**
   * Send an Overledger signed transaction
   *
   * @param {SignedTransactionRequest} signedTransaction
   */
  public send(signedTransaction: SignedTransactionRequest): AxiosPromise<Object> {
    return this.sdk.send(this.buildSignedTransactionsApiCall(signedTransaction));
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
   * Wrap a specific DLT signed transaction with the Overledger required fields
   *
   * @param {SignedTransactionRequest} signedTransaction
   *
   * @return {ApiCall}
   */
  public buildSignedTransactionsApiCall(stx: SignedTransactionRequest): SignedTransactionRequest {
    return {
      dlt: this.name,
      fromAddress: stx.fromAddress,
      amount: stx.amount,
      signedTransaction: stx.signedTransaction,
    };
  }

  /**
   * Create an account for a specific DLT
   *
   * @typedef {Object} Account
   * @property {string} privateKey The privateKey
   * @property {string} address The address
   *
   * @return {Account}
   */
  abstract createAccount(): Account;

  /**
   * Set an account for a specific DLT
   *
   * @param {string} privateKey The privateKey
   */
  abstract setAccount(privateKey: string): void;

  /**
   * Get the balance for a specific address
   *
   * @param {string} address The address to look at
   */
  getBalance(address: string = null): Promise<AxiosResponse> {
    if (address === null) {
      if (!this.account) {
        throw new Error('The account must be set up');
      }

      address = this.account.address;
    }

    return this.sdk.request.get(`/balances/${this.name}/${address}`);
  }
}

export default AbstractDLT;
