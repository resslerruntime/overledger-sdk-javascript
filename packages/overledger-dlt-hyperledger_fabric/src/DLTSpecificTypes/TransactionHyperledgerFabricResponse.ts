import { TransactionAccountsResponse } from '@quantnetwork/overledger-types';
import TransactionHyperledgerFabricSubTypeOptions from './associatedEnums/TransactionHyperledgerFabricSubTypeOptions';

/**
* A generic object used to describe an Overledger transaction response for the Ethereum blockchain. Note that this object inherits many parameters from TransactionAccountsResponse.
 * @typedef {Object} TransactionHyperledgerFabricResponse
 * @property {Object} subType - a redefinition of the TransactionResponse object, to add more Ethereum specific information
 */

/**
 * @memberof module:overledger-dlt-hyperledger_fabric
 */
interface TransactionHyperledgerFabricResponse extends TransactionAccountsResponse {
  subType: { name: TransactionHyperledgerFabricSubTypeOptions };
  extraFields: {
    //to add later if required
  };
}

export default TransactionHyperledgerFabricResponse;
