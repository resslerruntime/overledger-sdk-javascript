import { AxiosInstance, AxiosPromise, AxiosResponse } from 'axios';

export type Account = {
  privateKey: string,
  address: string,
};

export type Options = {
  privateKey?: string,
};

export type TransactionOptions = {
  sequence?: number,
  amount?: string | number,
};

export type ApiCall = {
  dlt: string,
  signedTransaction: string,
};

export type SignedTransactionResponse = {
  dlt: string,
  signedTransaction: string,
};

export type SDKOptions = {
  dlts: DltOptions[],
  network?: 'mainnet' | 'testnet',
  timeout?: number,
};

export type DltOptions = {
  dlt: string,
  privateKey?: string,
};

export type WrapperApiCall = {
  mappId: string,
  dltData: ApiCall[] | sequenceDataRequest[],
};

export type SignOptions = [{
  dlt: string,
  toAddress: string,
  message: string,
  options: TransactionOptions,
}];

export type sequenceDataRequest = {
  dlt: string,
  fromAddress: string,
};

export type sequenceDataResponse = [{
  dlt: string,
  sequence: number,
}];

export declare class OverledgerSDK {
    TESTNET: string;
    MAINNET: string;
    /**
     * The object storing the DLTs loaded by the Overledger sdk
     */
    dlts: {};
    overledgerUri: string;
    mappId: string;
    bpiKey: string;
    network: string;
    request: AxiosInstance;
    /**
     * @param {string} mappId
     * @param {string} bpiKey
     * @param {Object} options
     */
    constructor(mappId: string, bpiKey: string, options?: {});
    /**
     * Validate the provided options
     *
     * @param {Object} options
     */
    private validateOptions;
    /**
     * Configure the provided options
     *
     * @param {Object} options
     */
    private configure;
    /**
     * Sign transactions for the provided DLTs
     *
     * @param {Object} dlts Object of the DLTs where you want to send a transaction
     */
    sign(dlts: any): Promise<{
        dlt: any;
        signedTransaction: any;
    }[]>;
    /**
     * Wrap the DLTData with the api schema
     *
     * @param {array} dltData
     */
    private buildWrapperApiCall;
    /**
     * Send signed transactions to the provided DLTs
     *
     * @param {Object} signedTransactions Object of the DLTs where you want to send a transaction
     */
    send(signedTransactions: any): AxiosPromise<any>;
    /**
     * Load the dlt to the Overledger SDK
     *
     * @param {object} config
     *
     * @return {Provider}
     */
    private loadDlt;
    /**
     * Read by mapp id
     */
    readTransactionsByMappId(): Promise<any>;
    /**
     * read by overledger transaction id
     *
     * @param {string} ovlTransactionId
     */
    readByTransactionId(ovlTransactionId: any): Promise<any>;
    /**
     * Set the mapp id
     *
     * @param {string} mappId
     */
    setMappId(mappId: any): void;
    /**
     * get the mapp id
     */
    getMappId(): string;
    /**
     * set the bpi key
     *
     * @param {string} bpiKey
     */
    setBpiKey(bpiKey: any): void;
    /**
     * get the bpi key
     */
    getBpiKey(): string;
    /**
     * get the sequence for the required address
     */
    getSequences(sequenceData: sequenceDataRequest[]): AxiosPromise<sequenceDataResponse>;
};

export declare class Search {
  sdk: OverledgerSDK;
  request: AxiosInstance;
  /**
   * @param {Object} sdk
   * @param {Object} options
   */
  constructor(sdk: any);
  /**
   * Get transaction by a transaction hash (non-deterministic)
   *
   * @param {string} transactionHash Transaction hash
   */
  getTransaction(transactionHash: any): Promise<any>;
  /**
   * Get whoami
   *
   * @param {string} hash hash
   */
  whoami(hash: any): Promise<any>; 
  /**
   * Get block
   *
   * @param {string} hashOrNumber hash or number
   */
  getBlockByDltAndHash(dlt: any, hashOrNumber: any): Promise<any>;
};

export declare class AbstractDLT {
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
  getSequence(fromAddress: string): AxiosPromise<sequenceDataResponse>;

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
   * @return {ApiCall}
   */
  buildSignedTransactionsApiCall(signedTransaction: string): ApiCall;

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
};
