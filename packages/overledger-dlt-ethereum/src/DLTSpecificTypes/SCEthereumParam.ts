import TypeOptions from './associatedEnums/TypeOptions';
import BytesBOptions from './associatedEnums/BytesBOptions';
import UintIntBOptions from './associatedEnums/UintIntBOptions';
import {SCFunctionParam} from '@quantnetwork/overledger-types';

interface SCEthereumParam extends SCFunctionParam {
    type: {value: TypeOptions};
    value: {value: string};
    uintIntBValue?: UintIntBOptions;
    bytesBValue?: BytesBOptions;
    name?: string;
  }

export default SCEthereumParam;
