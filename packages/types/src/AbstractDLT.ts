import { AxiosPromise, AxiosResponse } from 'axios';
import OverledgerSDK from './OverledgerSDK';
import APICall from './APICall';
import TransactionOptions from './TransactionOptions';
import SequenceDataResponse from './SequenceDataResponse';

declare class AbstractDLT {
  name: string;
  sdk: OverledgerSDK;
  options: Object;

  account?: Account;

  constructor(sdk: OverledgerSDK, options: Object);

  /**
   * Sign a transaction for the DLT
   *
   * @param {string} toAddress
   * @param {string} message
   * @param {TransactionOptions} options
   */
  sign(toAddress: string, message: string, options: TransactionOptions): Promise<string>;

  /**
   * Internal method to sign a transaction for the DLT
   *
   * @param {string} toAddress
   * @param {string} message
   * @param {Object} options
   */
  _sign(toAddress: string, message: string, options?: TransactionOptions): Promise<string>;

  /**
   * Send a signed transactions array to overledger
   *
   * @param {string|string[]} signedTransaction
   */
  send(signedTransaction: string | string[]): AxiosPromise<Object>;

  /**
   * Get the sequence for a specific address
   *
   * @param {string|string[]} fromAddress
   */
  getSequence(fromAddress: string): AxiosPromise<SequenceDataResponse>;

  /**
   * Sign and send a DLT transaction to overledger
   *
   * @param {string} toAddress
   * @param {string} message
   * @param {TransactionOptions} options
   *
   * @return {Promise<axios>}
   */
  signAndSend(toAddress: string, message: string, options: TransactionOptions): Promise<AxiosResponse>;

  /**
   * Wrap a specific DLT signed transaction with the overledger
   *
   * @param {string} signedTransaction
   *
   * @return {APICall}
   */
  buildSignedTransactionsApiCall(signedTransaction: string): APICall;

  /**
   * Create an account for a specific DLT
   *
   * @typedef {Object} Account
   * @property {string} privateKey The privateKey
   * @property {string} address The address
   *
   * @return {Account}
   */
  createAccount(): Account;

  /**
   * Set an account for a specific DLT
   *
   * @param {string} privateKey The privateKey
   */
  setAccount(privateKey: string): void;

  /**
   * Fund an account
   *
   * @param {string} amount The amount to fund
   * @param {string} address the address to fund
   */
  fundAccount(amount: string, address: string): Promise<AxiosResponse>;

  /**
   * Get the balance for a specific address
   *
   * @param {string} address The address to look at
   */
  getBalance(address: string): Promise<AxiosResponse>;
}

export default AbstractDLT;