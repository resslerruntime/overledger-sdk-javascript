import TypeOptions from './associatedEnums/TypeOptions';
import UintIntMOptions from './associatedEnums/UintIntBOptions';
import BytesMOptions from './associatedEnums/BytesBOptions';

interface SCQueryInputValue {
    type: TypeOptions;
    uintIntMValue?: UintIntMOptions;
    bytesMValue?: BytesMOptions;
    value: string;
  }

export default SCQueryInputValue;
