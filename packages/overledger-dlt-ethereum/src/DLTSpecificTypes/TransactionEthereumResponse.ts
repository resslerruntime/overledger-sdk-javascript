import {TransactionAccountsResponse} from "@quantnetwork/overledger-types";

/**
* A generic object used to describe an Overledger transaction response for the Ethereum blockchain. Note that this object inherits many parameters from TransactionAccountsResponse.
 * @typedef {Object} TransactionEthereumResponse
 * @property {Object} subType - a redefinition of the TransactionResponse object, to add more Ethereum specific information
 * @property {string} compUnitPrice - the price paid per gas unit (in wei)
 * @property {string} compLimit - the maximum amount of gas units that this transaction can use, so maximum transaction price is: (compUnitPrice*compLimit)
 */

/**
 * @memberof module:overledger-dlt-ethereum
 */ 
interface TransactionEthereumResponse extends TransactionAccountsResponse {
        extraFields: {
            compUnitPrice: string,
            compLimit: string
        }
  };
  
  export default TransactionEthereumResponse;
  