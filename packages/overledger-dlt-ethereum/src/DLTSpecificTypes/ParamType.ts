import BytesBOptions from "./associatedEnums/BytesBOptions";
import TypeOptions from "./associatedEnums/TypeOptions";

function computeParamType(param: any): string {
    let paramType = param.type.toString();
    if (paramType === TypeOptions.bytesB || paramType === TypeOptions.bytesBArray) {
      paramType = (param.bytesBValue === BytesBOptions.b1) ? paramType.replace('B', '') : paramType.replace('B', param.bytesMValue);
    } else if (param.type === TypeOptions.uintB || param.type === TypeOptions.intB || param.type === TypeOptions.intBArray || param.type === TypeOptions.uintBArray) {
      paramType = paramType.replace('B', param.uintIntBValue);
    }
    return paramType.replace('Array', '[]');
  }

export default computeParamType;