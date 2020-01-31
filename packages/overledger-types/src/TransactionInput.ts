
import SmartContract from "./SmartContract";

/**
 * An generic object used to describe an input to a utxo transaction
 * @typedef {Object} TransactionInput
 * @property {string} linkedTx - the transaction that contains the output you want to use 
 * @property {number} linkedIndex - the index (in the linked transaction) of the output you want to use
 * @property {number} inputAmount - the amount that is contained in the referenced output. Set to 0 if not appropriate (i.e. not value is being exchanged)
 * @property {string} fromAddress - where this output is being spent from
 * @property {string} asset - the particular asset being moved by this transaction. Do not use if the native asset is being moved (e.g. BTC for Bitcoin) 
 * @property {SmartContract} smartContract - is there a particular enforcement on the spending of this input? Do not use if only the sender's signature is required
 */

/**
 * @memberof module:overledger-types
 */
type TransactionInput = {
        linkedTx: string,
        linkedIndex: number,
        amount: number,
        fromAddress: string, 
        asset?: string,
        smartContract?: SmartContract
  };
  
  export default TransactionInput;
  