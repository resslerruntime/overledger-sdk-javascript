import {TransactionAccountsRequest} from "@quantnetwork/overledger-types";

/**
* A generic object used to describe an Overledger transaction request for the Ethereum blockchain. Note that this object inherits many parameters from TransactionAccountsRequest.
 * @typedef {Object} TransactionAccountsRequest
 * @property {string} compUnitPrice - the price to pay per gas unit (in wei)
 * @property {string} compLimit - the maximum amount of gas units that this transaction can use, so maximum transaction price is: (compUnitPrice*compLimit)
 */

/**
 * @memberof module:overledger-dlt-ethereum
 */ 
interface TransactionEthereumRequest extends TransactionAccountsRequest {
        extraFields: {
            compUnitPrice: string,
            compLimit: string
        }
  };
  
  export default TransactionEthereumRequest;
  