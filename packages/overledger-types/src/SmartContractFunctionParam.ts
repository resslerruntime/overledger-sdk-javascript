
/**
 * A generic object to describe a smart contract function parameter.
 * @typedef {Object} SmartContractFunctionParam
 * @property {object} type - information on the parameter's type
 * @property {string} name - the parameter's name
 * @property {object} value - information on the parameter's value
 * @property {object} options - information the valid values that this parameter can take
 */

/**
 * @memberof module:overledger-types
 */
type SmartContractFunctionParam = {
  type: object,
  name?: string,
  value?: object,
  options?: object,
};

export default SmartContractFunctionParam;
