import TypeOptions from './associatedEnums/TypeOptions';
import UintIntMOptions from './associatedEnums/UintIntBOptions';
import BytesMOptions from './associatedEnums/BytesBOptions';

interface SCQueryOutputValue {
    type: TypeOptions;
    uintIntMValue: UintIntMOptions;
    bytesMValue?: BytesMOptions;
  }

export default SCQueryOutputValue;
