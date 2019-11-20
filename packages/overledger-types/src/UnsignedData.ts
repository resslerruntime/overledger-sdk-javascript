import TransactionOptions from './TransactionOptions';

/**
 * Unsigned transaction data.
 * @typedef {Object} UnsignedData
 * @property {string} dlt - The DLT used for this transaction.
 * @property {string} toAddress - The recipient for this transaction.
 * @property {string} message - The transaction message.
 * @property {TransactionOptions} options - The specific transaction options.
 */

/**
 * @memberof module:overledger-types
 */
type UnsignedData = {
  dlt: string,
  toAddress: string,
  message: string,
  options: TransactionOptions,
  dataMessageType?: DataMessageOptions
};

export enum DataMessageOptions {
  ascii = "ASCII",
  smartContractCreation = "SMART_CONTRACT_CREATION",
  smartContractInvocation = "SMART_CONTRACT_INVOCATION"
};

export default UnsignedData;
