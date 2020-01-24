import {TypeOptions, BytesBOptions, UintIntBOptions  } from './';

  /**
 * @memberof module:overledger-types
 */
export interface SCParameterOptions {
    type: TypeOptions;
    value: string;
    uintIntBValue?: UintIntBOptions;
    bytesBValue?: BytesBOptions;
    name?: string;
  }

export default SCParameterOptions;
