import TypeOptions from './associatedEnums/TypeOptions';
import { SCFunctionParam } from '@quantnetwork/overledger-types';

/**
 * A description of an HyperledgerFabric smart contract function parameter.
 * @typedef {Object} SCHyperledgerFabricParam
 * @property {object} type - information on the selectedType from the valid options.
 * If an integer or byte type was chosen then further information is required on the exact number of bytes being used.
 * If an integer is used, then selectedIntegerLength is required. If a byte is used then selectedBytesLength is required
 * @property {object} value - information on the parameter's value
 * @property {string} name - the parameter's name
 */

/**
* @memberof module:overledger-dlt-hyperledger_fabric
*/
interface SCHyperledgerFabricParam extends SCFunctionParam {
  type: { selectedType: TypeOptions, selectedArrayLength?: number };
  value: Object;
  name?: string;
}

export default SCHyperledgerFabricParam;
