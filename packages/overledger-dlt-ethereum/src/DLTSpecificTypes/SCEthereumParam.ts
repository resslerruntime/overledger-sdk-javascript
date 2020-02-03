import TypeOptions from './associatedEnums/TypeOptions';
import BytesBOptions from './associatedEnums/BytesBOptions';
import UintIntBOptions from './associatedEnums/UintIntBOptions';
import {SCFunctionParam} from '@quantnetwork/overledger-types';

interface SCEthereumParam extends SCFunctionParam {
    type: {selectedType: TypeOptions, selectedIntegerLength?: UintIntBOptions, selectedBytesLength?: BytesBOptions};
    value: Object;
    name?: string;
  }

export default SCEthereumParam;
