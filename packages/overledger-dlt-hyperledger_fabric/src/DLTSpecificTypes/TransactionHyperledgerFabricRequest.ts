import { TransactionAccountsRequest } from '@quantnetwork/overledger-types';
import TransactionHyperledgerFabricSubTypeOptions from './associatedEnums/TransactionHyperledgerFabricSubTypeOptions';

/**
* A generic object used to describe an Overledger transaction request for the HyperledgerFabric blockchain. Note that this object inherits many parameters from TransactionAccountsRequest.
 * @typedef {Object} TransactionHyperledgerFabricRequest
 * @property {Object} subType - a redefinition of the TransactionRequest object, to add more HyperledgerFabric specific information
 */

/**
 * @memberof module:overledger-dlt-hyperledger_fabric
 */
interface TransactionHyperledgerFabricRequest extends TransactionAccountsRequest {
  subType: { name: TransactionHyperledgerFabricSubTypeOptions };
  extraFields: {
    //to add later if required
  };
}

export default TransactionHyperledgerFabricRequest;
