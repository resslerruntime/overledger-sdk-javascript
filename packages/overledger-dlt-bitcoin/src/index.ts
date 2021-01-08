/**
 * @module overledger-dlt-bitcoin
 */

import Bitcoin from './Bitcoin';
import TransactionBitcoinSubTypeOptions from './DLTSpecificTypes/associatedEnums/TransactionBitcoinSubTypeOptions';
import TransactionBitcoinRequest from './DLTSpecificTypes/TransactionBitcoinRequest';
import TransactionBitcoinResponse from './DLTSpecificTypes/TransactionBitcoinResponse';
import TransactionBitcoinScriptTypeOptions from './DLTSpecificTypes/associatedEnums/TransactionBitcoinScriptTypeOptions';

/**
 * Objects and interfaces used when interacting with the Bitcoin blockchain package
 */
export {
    TransactionBitcoinSubTypeOptions,
    TransactionBitcoinRequest,
    TransactionBitcoinResponse,
    TransactionBitcoinScriptTypeOptions
};
/**
 * Development package for Bitcoin blockchain.
 */
export default Bitcoin;
