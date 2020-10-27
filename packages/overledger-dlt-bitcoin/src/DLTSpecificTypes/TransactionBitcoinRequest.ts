import { TransactionUtxoRequest } from '@quantnetwork/overledger-types';
import TransactionBitcoinSubTypeOptions from './associatedEnums/TransactionBitcoinSubTypeOptions';
/**
* A generic object used to describe an Overledger transaction request for the Bitcoin blockchain. Note that this object inherits many parameters from TransactionUtxoRequest.
 * @typedef {Object} TransactionBitcoinRequest
 * @property {Object} subType - a redefinition of the TransactionRequest object, to add more Bitcoin specific information
 * @property {string} feePrice - the fee to pay for this transaction to enter the Bitcoin ledger. It is denoted in Satoshis.
 */

/**
 * @memberof module:overledger-dlt-bitcoin
 */
interface TransactionBitcoinRequest extends TransactionUtxoRequest {
  subType: { name: TransactionBitcoinSubTypeOptions };
  extraFields: {
    feePrice: string,
  };
  script?: Array<any>,
  addressType?: string,
  redeemScript?: Buffer 
}

export default TransactionBitcoinRequest;
