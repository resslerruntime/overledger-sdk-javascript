import TransactionResponse from "./TransactionResponse";
import TransactionInput from "./TransactionInput";
import TransactionOutput from "./TransactionOutput";

/**
 * A generic object used to describe an Overledger transaction response for utxo based distributed ledgers. 
 * @typedef {Object} TransactionResponse
 * @property {TransactionInput[]} txInputs - the inputs of this transaction
 * @property {TransactionOutput[]} txOutputs - the outputs of this transaction
 */

/**
 * @memberof module:overledger-types
 */
interface TransactionUtxoResponse extends TransactionResponse {
        txInputs: TransactionInput[],
        txOutputs: TransactionOutput[]
  };
  
  export default TransactionUtxoResponse;
  