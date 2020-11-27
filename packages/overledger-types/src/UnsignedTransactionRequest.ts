/**
 * Overledger signed transaction request object.
 * @typedef {Object} UnsignedTransactionRequest
 * @property {string} dlt - The distributed ledger technology.
 * @property {Object} txObject - The unsigned transaction object.
 */

/**
 * @memberof module:overledger-types
 */
type UnsignedTransactionRequest = {
  dlt: string,
  txObject: Object,
};

export default UnsignedTransactionRequest;
