import TransactionResponse from "./TransactionResponse";
import TransactionInput from "./TransactionInput";
import TransactionOutput from "./TransactionOutput";

/**
 * A generic object used to describe a transaction for utxo based distributed ledgers. 
 * @typedef {Object} TransactionResponse
 * @property {Object[]} txInputs - the inputs of this transaction
 * @property {Object[]} txOutputs - the outputs of this transaction
 */

/**
 * @memberof module:overledger-types
 */
interface TransactionUtxoResponse extends TransactionResponse {
        txInputs: TransactionInput[],
        txOutputs: TransactionOutput[]
  };
  
  export default TransactionUtxoResponse;
  