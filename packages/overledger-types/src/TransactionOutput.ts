
import SmartContract from "./SmartContract";

/**
 * An generic object used to describe an output to a utxo transaction
 * @typedef {Object} TransactionOutput
 * @property {number} outputAmount - the amount that is to be sent in this output
 * @property {string} toAddress - who is receiving this spendable output
 * @property {string} asset - the particular asset being moved by this transaction. Do not use if the native asset is being moved (e.g. BTC for Bitcoin) 
 * @property {SmartContract} smartContract - is there a particular enforcement on the spending of this output? Do not use if only the sender's signature is required
 */

/**
 * @memberof module:overledger-types
 */
type TransactionOutput = {
        amount: number,
        toAddress: string, 
        asset?: string,
        smartContract?: SmartContract
  };
  
  export default TransactionOutput;
  