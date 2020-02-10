import EthereumBytesOptions from "./associatedEnums/BytesBOptions";
import EthereumTypeOptions from "./associatedEnums/TypeOptions";

/**
 * This function is used to prepare the parameter definition for the web3 package
 * @param param - the parameter definition
 */
function computeParamType(param: any): string {
    let paramType = param.type.selectedType.toString();
    if (paramType === EthereumTypeOptions.bytesB || paramType === EthereumTypeOptions.bytesBArray) {
      paramType = (param.type.selectedBytesLength === EthereumBytesOptions.b1) ? paramType.replace('B', '') : paramType.replace('B', param.type.selectedBytesLength);
    } else if (paramType === EthereumTypeOptions.uintB || paramType === EthereumTypeOptions.intB || paramType === EthereumTypeOptions.intBArray || paramType === EthereumTypeOptions.uintBArray) {
      paramType = paramType.replace('B', param.type.selectedIntegerLength);
    }
    return paramType;//.replace('Array', '[]');
  }

export default computeParamType;