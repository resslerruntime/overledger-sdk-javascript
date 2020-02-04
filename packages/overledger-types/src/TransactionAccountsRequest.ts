import TransactionRequest from "./TransactionRequest";
import SmartContract from "./SmartContract";

/**
 * A generic object used to describe an Overledger transaction request for accounts based distributed ledgers. 
 * @typedef {Object} TransactionAccountsRequest
 * @property {string} fromAddress - who is sending this transaction
 * @property {string} toAddress - where is this transaction being sent to. 
 * @property {number} sequence - used to order transactions sent from this address. You should set the sequence to the next increment value
 * @property {number} amount -  the amount that is to be sent in this transaction in the lowest unit for the respective DLT. Set to 0 if not appropriate (i.e. no value is being exchanged)
 * @property {string} asset - the particular asset being moved by this transaction. No need to use if you are transferring the native asset of the distributed ledger (e.g. Eth on Ethereum) 
 * @property {Object} smartContract - information on what smart contract you want to deploy or invoke
 */

/**
 * @memberof module:overledger-types
 */
interface TransactionAccountsRequest extends TransactionRequest {
        fromAddress: string,
        toAddress: string,
        sequence: number,
        amount: number,
        asset?: string,
        smartContract?: SmartContract,
  };
  
  export default TransactionAccountsRequest;
  