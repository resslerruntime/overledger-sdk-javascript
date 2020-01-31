import TransactionRequest from "./TransactionRequest";
import TransactionInput from "./TransactionInput";
import TransactionOutput from "./TransactionOutput";

/**
 * Object used to build a transaction for utxo based distributed ledgers.
 * @typedef {Object} TransactionUtxoRequest
 * @property {Object[]} txInputs - the inputs of this transaction
 * @property {Object[]} txOutputs - the outputs of this transaction
 */

/**
 * @memberof module:overledger-types
 */
interface TransactionUtxoRequest extends TransactionRequest {
      txInputs: TransactionInput[],
      txOutputs: TransactionOutput[]
  };
  
  export default TransactionUtxoRequest;
  