
/**
 * A smart contract object.
 * @typedef {Object} SmartContract
 * @property {DltNames} distributedLedger - the distributed ledger this transaction is for
 * @property {TransactionType} type - the type of distributed ledger this transaction is for
 * @property {TransactionSubType} subType - further details on the actions of this transaction
 * @property {number} amount - Is any value being transferred by this transaction
 * @property {string} message - is there any message (e.g. hash) to embed within this transaction (possibly for auditability purposes)
 * @property {Object} additionalFields - are there any distributed ledger specific fields required for building the transaction? Check the documentation for information on this
 */

/**
 * @memberof module:overledger-types
 */
type SCFunctionParam = {
    type: object,
    value?: object,
    options?: object
  };
  
  export default SCFunctionParam;
  