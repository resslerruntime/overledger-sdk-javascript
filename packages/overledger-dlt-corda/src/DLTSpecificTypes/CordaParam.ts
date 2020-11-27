
/**
 * A description of an Corda smart contract function parameter.
 * @typedef {Object} CordaParam
 * @property {object} type - information on the selectedType from the valid options.
 * If an integer or byte type was chosen then further information is required on the exact number of bytes being used.
 * If an integer is used, then selectedIntegerLength is required. If a byte is used then selectedBytesLength is required
 * @property {object} value - information on the parameter's value
 * @property {string} name - the parameter's name
 */

/**
* @memberof module:overledger-dlt-corda
*/
interface CordaParam {
  name: string;
  value: Object;
}

export default CordaParam;
