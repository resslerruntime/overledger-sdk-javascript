import {TransactionUtxoResponse} from "@quantnetwork/overledger-types";
import TransactionBitcoinSubTypeOptions from "./associatedEnums/TransactionBitcoinSubTypeOptions";
/**
* A generic object used to describe an Overledger transaction response for the Bitcoin blockchain. Note that this object inherits many parameters from TransactionUtxoResponse.
 * @typedef {Object} TransactionBitcoinResponse
 * @property {Object} subType - a redefinition of the TransactionResponse object, to add more Bitcoin specific information
 * @property {string} feePrice - the fee to pay for this transaction to enter the Bitcoin ledger. It is denoted in Bitcoin - therefore use decimals.
 */

/**
 * @memberof module:overledger-dlt-bitcoin
 */ 
interface TransactionBitcoinResponse extends TransactionUtxoResponse {
    subType: {name: TransactionBitcoinSubTypeOptions},
    extraFields: {
        feePrice: string
    }
  };
  
  export default TransactionBitcoinResponse;
  