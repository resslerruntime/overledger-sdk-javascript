
/**
 * A generic object to describe a smart contract.
 * @typedef {Object} TransactionValidationCheck
 * @property {boolean} success - was the validation check successful?
 * @property {string} failingField - if it was not successful, what was the first field that failed?
 * @property {string} error - Is there any more information on this error?
 */

/**
 * @memberof module:overledger-types
 */
type TransactionValidationCheck = {
    success: boolean,
    failingField?: string,
    error?: string
  };
  
  export default TransactionValidationCheck;
  