import { TransactionAccountsResponse } from '@quantnetwork/overledger-types';
import TransactionXRPSubTypeOptions from './associatedEnums/TransactionXRPSubTypeOptions';
import AtomicSwapXRPParams from './AtomicSwapXRPParams';
import TrustLineXRPOptions from './TrustLineXRPParams';

/**
* A generic object used to describe an Overledger transaction response for the XRP Ledger. Note that this object inherits many parameters from TransactionAccountsResponse.
* @typedef {Object} TransactionEthereumResponse
* @property {Object} subType - a redefinition of the TransactionResponse object, to add more XRP specific information
* @property {string} feePrice - the fee paid for this transaction to enter the XRP ledger. It is denoted in drops where the current minimum allowed is 12.
* @property {string} maxLedgerVersion - The maximum ledger version the transaction can be included in
* @property {string} currency - Any non-XRP currency should be stated. Optional.
* @property {AtomicSwapXRPParams} atomicSwapParameters - optional atomic swap parameters
* @property {TrustLineXRPOptions} trustlineParameters - optional properties to establish a trustline between users
*/

/**
 * @memberof module:overledger-dlt-xrp
 */
interface TransactionXRPResponse extends TransactionAccountsResponse {
  subType: { name: TransactionXRPSubTypeOptions };
  extraFields: {
    feePrice: string,
    maxLedgerVersion: string,
    currency: string,
    atomicSwapParameters?: AtomicSwapXRPParams,
    trustlineParameters?: TrustLineXRPOptions,
  };
}

export default TransactionXRPResponse;
