import { TypeOptions, BytesMOptions } from ".";

function computeParamType(param: any): string {
    let paramType = param.type.toString();
    if (paramType === TypeOptions.bytesM || paramType === TypeOptions.bytesMArray) {
      paramType = (param.bytesMValue === BytesMOptions.m1) ? paramType.replace('M', '') : paramType.replace('M', param.bytesMValue);
    } else if (param.type === TypeOptions.uintM || param.type === TypeOptions.intM || param.type === TypeOptions.intMArray || param.type === TypeOptions.uintMArray) {
      paramType = paramType.replace('M', param.uintIntMValue);
    }
    return paramType.replace('Array', '[]');
  }

export default computeParamType;