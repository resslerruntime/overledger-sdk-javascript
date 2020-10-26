import { TransactionUtxoRequest } from '@quantnetwork/overledger-types';
import TransactionCordaSubTypeOptions from './associatedEnums/TransactionCordaSubTypeOptions';

/**
* A generic object used to describe an Overledger transaction request for the Corda blockchain. Note that this object inherits many parameters from TransactionUtxoRequest.
 * @typedef {Object} TransactionCordaRequest
 * @property {Object} subType - a redefinition of the TransactionRequest object, to add more Corda specific information
 */

/**
 * @memberof module:overledger-dlt-corda
 */
interface TransactionCordaRequest extends TransactionUtxoRequest {
  subType: { name: TransactionCordaSubTypeOptions };
  extraFields: {
    //..to complete later
  };
}

export default TransactionCordaRequest;
