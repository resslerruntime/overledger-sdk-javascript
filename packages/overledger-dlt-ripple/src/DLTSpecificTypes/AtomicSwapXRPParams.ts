
/**
* An object used to describe the atomic swap params required for XRP
 * @typedef {Object} AtomicSwapXRPParams
 * @property {Object} allowCancelAfter - from when can the escrow be executed? In ISOString format
 * @property {Object} allowExecuteAfter - from when can the escrow be cancelled? In ISOString format
 * @property {Object} hashAlgorithmInputString - this is the sha256 hash algorithm input as a string. It will NOT be placed on the ledger when creating a transaction. 
 * @property {Object} hashAlgorithmCondition - this is if there has been a hash string placed onto another chain and now we want to add it to this chain.
 * @property {string} escrowSequence - The sequence number of the escrow you are executing or cancelling
 * @property {string} hashAlgorithmFulfillment - This is the value to unlock the escrow (the input to the sha256 hash algorithm)
 * @property {string} owner - The address that funded the escrow

 */

/**
 * @memberof module:overledger-dlt-xrp
 */
/**
 * One of hashAlgorithmInput or hashAlgorithmOutput should be choosen depending on if you are starting the swap on this chain or another chain respectively
 */
interface AtomicSwapCreateOptions {
  allowCancelAfter: string; 
  allowExecuteAfter: string;
  hashAlgorithmInputString?: string; 
  hashAlgorithmCondition?: string;
}

interface AtomicSwapExecuteOptions {
  owner: string;
  escrowSequence: string; 
  hashAlgorithmInputString?: string; 
  hashAlgorithmCondition?: string;
  hashAlgorithmFulfillment?: string;
}

interface AtomicSwapCancelOptions {
  owner: string;
  escrowSequence: string; 
}


type AtomicSwapXRPParams = AtomicSwapCreateOptions | AtomicSwapExecuteOptions | AtomicSwapCancelOptions;

export default AtomicSwapXRPParams;