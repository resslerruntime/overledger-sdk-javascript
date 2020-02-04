import {TransactionAccountsRequest} from "@quantnetwork/overledger-types";

/**
* A generic object used to describe an Overledger transaction request for the XRP Ledger. Note that this object inherits many parameters from TransactionAccountsRequest.
 * @typedef {Object} TransactionAccountsRequest
 * @property {string} feePrice - the fee to pay for this transaction to enter the XRP ledger. It is denoted in drops where the current minimum allowed is 12.
 * @property {string} maxLedgerVersion - The maximum ledger version the transaction can be included in
 */

/**
 * @memberof module:overledger-dlt-xrp
 */
interface TransactionXRPRequest extends TransactionAccountsRequest {
        extraFields: {
            feePrice: string,
            maxLedgerVersion: string
        }
  };
  
  export default TransactionXRPRequest;
  