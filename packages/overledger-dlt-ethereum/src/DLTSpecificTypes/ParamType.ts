
import EthereumTypeOptions from './associatedEnums/TypeOptions';

/**
 * This function is used to prepare the parameter definition for the web3 package
 * @param param - the parameter definition
 */
function computeParamType(param: any): string {
  let paramType = param.type.selectedType.toString();
  if (paramType === EthereumTypeOptions.BYTES_B) {
    paramType = 'bytes' + param.type.selectedBytesLength.toString();
  } else if (paramType === EthereumTypeOptions.BYTES_B_ARRAY) {
    paramType = 'bytes' + param.type.selectedBytesLength.toString() + '[]';
  } else if (paramType === EthereumTypeOptions.UINT_B) {
    paramType = 'uint' + param.type.selectedIntegerLength.toString();
  } else if (paramType === EthereumTypeOptions.INT_B) {
    paramType = 'int' + param.type.selectedIntegerLength.toString();
  } else if (paramType === EthereumTypeOptions.UINT_B_ARRAY) {
    paramType = 'uint' + param.type.selectedIntegerLength.toString() + '[]';
  } else if (paramType === EthereumTypeOptions.INT_B_ARRAY) {
    paramType = 'int' + param.type.selectedIntegerLength.toString() + '[]';
  }
  return paramType;
}

export default computeParamType;
