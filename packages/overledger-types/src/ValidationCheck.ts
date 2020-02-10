
/**
 * A generic object to describe a validationCheck.
 * @typedef {Object} validationCheck
 * @property {boolean} success - was the validation check successful?
 * @property {string} failingField - if it was not successful, what was the first field that failed?
 * @property {string} error - Is there any more information on this error?
 */

/**
 * @memberof module:overledger-types
 */
type validationCheck = {
    success: boolean,
    failingField?: string,
    error?: string
  };
  
  export default validationCheck;
  