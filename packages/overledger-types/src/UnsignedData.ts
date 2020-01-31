import TransactionOptions from './TransactionOptions';
import TransactionTypeOptions from './associatedEnums/TransactionTypeOptions';

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
  transactionType?: TransactionTypeOptions
};

export default UnsignedData;
