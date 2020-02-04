import EthereumBytesOptions from "./associatedEnums/BytesBOptions";
import EthereumTypeOptions from "./associatedEnums/TypeOptions";

function computeParamType(param: any): string {
    let paramType = param.type.selectedType.toString();
    console.log("param.type.selectedType.toString():" + param.type.selectedType.toString());
    if (paramType === EthereumTypeOptions.bytesB || paramType === EthereumTypeOptions.bytesBArray) {
      console.log("param.type.selectedBytesLength:" + param.type.selectedBytesLength);
      paramType = (param.type.selectedBytesLength === EthereumBytesOptions.b1) ? paramType.replace('B', '') : paramType.replace('B', param.type.selectedBytesLength);
    } else if (paramType === EthereumTypeOptions.uintB || paramType === EthereumTypeOptions.intB || paramType === EthereumTypeOptions.intBArray || paramType === EthereumTypeOptions.uintBArray) {
      console.log("param.type.selectedIntegerLength:" + param.type.selectedIntegerLength);
      paramType = paramType.replace('B', param.type.selectedIntegerLength);
    }
    return paramType;//.replace('Array', '[]');
  }

export default computeParamType;