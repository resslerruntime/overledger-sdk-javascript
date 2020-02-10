import DltNames from "./associatedEnums/DltNameOptions";
import TransactionType from "./associatedEnums/TransactionTypeOptions";
import TransactionSubType from "./associatedEnums/TransactionSubTypeOptions";
import TransactionStatus from "./associatedEnums/TransactionStatusOptions";
import TimeStampUnits from "./associatedEnums/TimeStampUnitsOptions";

/**
 * A generic object used to describe an Overledger transaction response for any type of distributed ledger. 
 * @typedef {Object} TransactionResponse
 * @property {DltNames} dlt - the distributed ledger this transaction is for
 * @property {TransactionType} type - the type of distributed ledger this transaction is for
 * @property {TransactionSubType} subType - further details on the actions of this transaction
 * @property {string} message - is there any message (e.g. hash) to embed within this transaction (possibly for auditability purposes)
 * @property {number} id - the id (e.g. hash) of this transaction on the ledger
 * @property {string} timestamp - the timestamp (e.g. confirmation time)
 * @property {TimeStampUnits} timestampUnit - the timestamp unit.
 * @property {TransactionStatus} status - the status of the transaction (e.g. broadcast, confirmed, etc)
 * @property {string[]} signature - what are the signatures of the transaction
 * @property {Object} extraFields - are there any distributed ledger specific fields required for the transaction? Before a field is added here, the other objects that extend this one should be inspected to see if there is a parameter that is suitable embedded within them. Check the documentation for more information on this
 */

/**
 * @memberof module:overledger-types
 */
type TransactionResponse = {
    dlt: DltNames,
    type: TransactionType,
    subType: TransactionSubType,
    message: string,
    id: string,  
    timestamp: string,   
    timestampUnit: TimeStampUnits,  
    status: TransactionStatus,  
    signature: string[], 
    extraFields?: Object
  };
  
  export default TransactionResponse;
  