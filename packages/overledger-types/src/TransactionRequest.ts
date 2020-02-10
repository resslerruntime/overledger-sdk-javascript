import DltNames from "./associatedEnums/DltNameOptions";
import TransactionType from "./associatedEnums/TransactionTypeOptions";
import TransactionSubType from "./associatedEnums/TransactionSubTypeOptions";

/**
 * A generic object used to describe an Overledger transaction request for any type of distributed ledger. 
 * @typedef {Object} TransactionRequest
 * @property {DltNames} dlt - the distributed ledger technology this transaction is for
 * @property {TransactionType} type - the type of storage model this distributed ledger uses. Transactions for this distributed ledger will follow this format
 * @property {TransactionSubType} subType - further details on the action this transaction is performing
 * @property {string} message - is there any message (e.g. hash) to embed within this transaction (possibly for auditability purposes)
 * @property {Object} extraFields - are there any distributed ledger specific fields required for building the transaction? Before adding a field here, inspect the objects that extend this one to see if there is a parameter that is suitable embedded within them. Check the documentation for more information on this
 */

/**
 * @memberof module:overledger-types
 */
type TransactionRequest = {
    dlt: DltNames,
    type: TransactionType,
    subType: TransactionSubType,
    message: string,
    extraFields?: Object
  };
  
  export default TransactionRequest;
  