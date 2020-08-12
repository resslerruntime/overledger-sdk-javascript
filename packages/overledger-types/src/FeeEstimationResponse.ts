/**
 * Fee estimation from different DLT
 * @typedef {string} dlt name
 * @property {object} data from the fee estimation call
 */

/**
 * @memberof module:overledger-types
 */
type FeeEstimationResponse = {
  dlt: string,
  data: object,
};

export default FeeEstimationResponse;
