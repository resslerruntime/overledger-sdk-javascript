
import HyperledgerFabricTypeOptions from './associatedEnums/TypeOptions';

/**
 * This function is used to prepare the parameter definition for the web3 package
 * @param param - the parameter definition
 */
function computeParamType(param: any): string {
  let paramType = param.type.selectedType.toString();
  const paramArrayLength = param.type.selectedArrayLength;
  if (paramType === HyperledgerFabricTypeOptions.BOOLEAN) {
    paramType = 'bool';
  } else if (paramType === HyperledgerFabricTypeOptions.BOOLEAN_ARRAY) {
    paramType = paramArrayLength ? `bool[${paramArrayLength.toString()}]` : 'bool[]';
  } else if (paramType === HyperledgerFabricTypeOptions.INTEGER) {
    paramType = `int`;
  } else if (paramType === HyperledgerFabricTypeOptions.INTEGER_ARRAY) {
    paramType = paramArrayLength ? `int[${paramArrayLength.toString()}]` : `int[]`;
  } else if (paramType === HyperledgerFabricTypeOptions.DOUBLE) {
    paramType = `double`;
  } else if (paramType === HyperledgerFabricTypeOptions.DOUBLE_ARRAY) {
    paramType = paramArrayLength ? `double[${paramArrayLength.toString()}]` : `double[]`;
  } else if (paramType === HyperledgerFabricTypeOptions.STRING) {
    paramType = 'string';
  } else if (paramType === HyperledgerFabricTypeOptions.STRING_ARRAY) {
    paramType = paramArrayLength ? `string[${paramArrayLength.toString()}]` : `string[]`;
  }
  return paramType;
}

export default computeParamType;
