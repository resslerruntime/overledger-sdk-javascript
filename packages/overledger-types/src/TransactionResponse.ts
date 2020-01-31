import DltNames from "./associatedEnums/DltNameOptions";
import TransactionType from "./associatedEnums/TransactionTypeOptions";
import TransactionSubType from "./associatedEnums/TransactionSubTypeOptions";
import TransactionStatus from "./associatedEnums/TransactionStatusOptions";
import TimeStampUnits from "./associatedEnums/TimeStampUnitsOptions";

/**
 * A generic object used to describe a utxo or an account based transaction for a distributed ledger.
 * @typedef {Object} TransactionResponse
 * @property {DltNames} distributedLedger - the distributed ledger this transaction is for
 * @property {TransactionType} type - the type of distributed ledger this transaction is for
 * @property {TransactionSubType} subType - further details on the actions of this transaction
 * @property {number} amount - Is any value being transferred by this transaction
 * @property {string} message - is there any message (e.g. hash) to embed within this transaction (possibly for auditability purposes)
 * @property {number} identifier - the id (e.g. hash) of this transaction on the ledger
 * @property {string} timestamp - the timestamp (e.g. confirmation time)
 * @property {TimeStampUnits} timestampUnit - the timestamp unit.
 * @property {Object} additionalFields - are there any distributed ledger specific fields required for building the transaction? Check the documentation for information on this 
 */

/**
 * @memberof module:overledger-types
 */
type TransactionResponse = {
    dlt: DltNames,
    type: TransactionType,
    subType: TransactionSubType,
    message: string,
    id: number,  
    timestamp: string,   
    timestampUnit: TimeStampUnits,  
    status: TransactionStatus,  
    signature: string[], 
    extraFields?: Object
  };
  
  export default TransactionResponse;
  