import { TransactionAccountsRequest } from '@quantnetwork/overledger-types';
import TransactionEthereumSubTypeOptions from './associatedEnums/TransactionEthereumSubTypeOptions';

/**
* A generic object used to describe an Overledger transaction request for the Ethereum blockchain. Note that this object inherits many parameters from TransactionAccountsRequest.
 * @typedef {Object} TransactionEthereumRequest
 * @property {Object} subType - a redefinition of the TransactionRequest object, to add more Ethereum specific information
 * @property {string} compUnitPrice - the price to pay per gas unit (in wei)
 * @property {string} compLimit - the maximum amount of gas units that this transaction can use, so maximum transaction price is: (compUnitPrice*compLimit)
 */

/**
 * @memberof module:overledger-dlt-ethereum
 */
interface TransactionEthereumRequest extends TransactionAccountsRequest {
  subType: { name: TransactionEthereumSubTypeOptions };
  extraFields: {
    compUnitPrice: string,
    compLimit: string,
  };
}

export default TransactionEthereumRequest;
