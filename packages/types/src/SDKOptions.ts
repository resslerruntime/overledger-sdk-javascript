import DLTOptions from './DLTOptions';
import ProviderOptions from './ProviderOptions';

/**
 * @memberof module:types
 */
type SDKOptions = {
  dlts: DLTOptions[],
  provider?: ProviderOptions,
};

export default SDKOptions;
