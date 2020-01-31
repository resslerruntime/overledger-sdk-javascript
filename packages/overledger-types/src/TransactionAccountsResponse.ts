import TransactionResponse from "./TransactionResponse";
import SmartContract from "./SmartContract";

/**
 * A generic object used to describe a transaction for accounts based distributed ledgers. 
 * @typedef {Object} TransactionAccountsResponse
 * @property {string} fromAddress - who is sending this transaction
 * @property {string} toAddress - where is this transaction being sent to. This property may not be used for deploying smart contracts onto some distributed ledgers - check documentation
 * @property {number} sequence - used to order transactions sent from this address. You should set the sequence to the next increment value
 * @property {string} asset - what asset are you transfering between users. No need to use if you are transferring the native asset of the distributed ledger (e.g. Eth on Ethereum) 
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
  