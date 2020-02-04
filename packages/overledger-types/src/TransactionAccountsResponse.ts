import TransactionResponse from "./TransactionResponse";
import SmartContract from "./SmartContract";

/**
 * A generic object used to describe an Overledger transaction response for accounts based distributed ledgers. Note that this object inherits many parameters from TransactionResponse.
 * @typedef {Object} TransactionAccountsResponse
 * @property {string} fromAddress - who sent this transaction
 * @property {string} toAddress - where this transaction was sent to. 
 * @property {number} sequence - used to order transactions sent from this address.
 * @property {number} amount -  the amount that is being sent in this transaction. Set to 0 if not appropriate (i.e. no value is being exchanged)
 * @property {string} asset - the particular asset being moved by this transaction. No need to use if you are transferring the native asset of the distributed ledger (e.g. Eth on Ethereum) 
 * @property {Object} smartContract - information on what smart contract you want to deploy or invoke
 */

/**
 * @memberof module:overledger-types
 */
interface TransactionAccountsResponse extends TransactionResponse {
        fromAddress: string,
        toAddress: string,
        sequence: number,
        amount: number,
        asset?: string,
        smartContract?: SmartContract,
  };
  
  export default TransactionAccountsResponse;
  