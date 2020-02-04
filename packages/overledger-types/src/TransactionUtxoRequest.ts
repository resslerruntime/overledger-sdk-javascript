import TransactionRequest from "./TransactionRequest";
import TransactionInput from "./TransactionInput";
import TransactionOutput from "./TransactionOutput";

/**
 * A generic object used to describe an Overledger transaction request for utxo based distributed ledgers. 
 * @typedef {Object} TransactionUtxoRequest
 * @property {TransactionInput[]} txInputs - the inputs of this transaction
 * @property {TransactionOutput[]} txOutputs - the outputs of this transaction
 */

/**
 * @memberof module:overledger-types
 */
interface TransactionUtxoRequest extends TransactionRequest {
      txInputs: TransactionInput[],
      txOutputs: TransactionOutput[]
  };
  
  export default TransactionUtxoRequest;
  