import { TransactionUtxoResponse } from '@quantnetwork/overledger-types';
import TransactionCordaSubTypeOptions from './associatedEnums/TransactionCordaSubTypeOptions';

/**
* A generic object used to describe an Overledger transaction response for the Corda blockchain. Note that this object inherits many parameters from TransactionUtxoResponse.
 * @typedef {Object} TransactionCordaResponse
 * @property {Object} subType - a redefinition of the TransactionResponse object, to add more Corda specific information
 */

/**
 * @memberof module:overledger-dlt-corda
 */
interface TransactionCordaResponse extends TransactionUtxoResponse {
  subType: { name: TransactionCordaSubTypeOptions };
  extraFields: {
    //..to complete later
  };
}

export default TransactionCordaResponse;
