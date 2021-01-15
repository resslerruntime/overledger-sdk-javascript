import { TransactionAccountsRequest } from '@quantnetwork/overledger-types';
import AtomicSwapXRPParams from './AtomicSwapXRPParams';
import TrustLineXRPOptions from './TrustLineXRPParams';
import TransactionXRPSubTypeOptions from './associatedEnums/TransactionXRPSubTypeOptions';

/**
* A generic object used to describe an Overledger transaction request for the XRP Ledger. Note that this object inherits many parameters from TransactionAccountsRequest.
 * @typedef {Object} TransactionAccountsRequest
 * @property {Object} subType - a redefinition of the TransactionRequest object, to add more XRP specific information
 * @property {string} feePrice - the fee to pay for this transaction to enter the XRP ledger. It is denoted in drops where the current minimum allowed is 12.
 * @property {string} maxLedgerVersion - The maximum ledger version the transaction can be included in
 * @property {string} currency - Any non-XRP currency should be stated. Optional.
 * @property {AtomicSwapXRPParams} atomicSwapParameters - optional atomic swap parameters
 * @property {TrustLineXRPOptions} trustlineParameters - optional properties to establish a trustline between users

 */

/**
 * @memberof module:overledger-dlt-xrp
 */
interface TransactionXRPRequest extends TransactionAccountsRequest {
  subType: { name: TransactionXRPSubTypeOptions };
  extraFields: {
    feePrice: string,
    maxLedgerVersion: string,
    currency?: string,
    atomicSwapParameters?: AtomicSwapXRPParams,
    trustlineParameters?: TrustLineXRPOptions,
  };
}

export default TransactionXRPRequest;
