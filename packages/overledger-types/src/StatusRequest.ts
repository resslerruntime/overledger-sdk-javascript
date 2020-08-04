/**
 * Status request.
 * @typedef {Object} StatusRequest
 * @property {string} mappId - mappId
 * @property {string} callbackUrl - The address which the updates send to.
 * @property {string} timestamp - The timestamp
 * @property {string} overledgerTransactionId - The overledgerTransactionId
 * 
 */

/**
 * @memberof module:overledger-types
 */
type StatusRequest = {
    mappId: string,
    callbackUrl: string,
    timestamp?: string,
    overledgerTransactionId: string

  };
  
  export default StatusRequest;
  