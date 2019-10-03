import DLTOptions from './DLTOptions';
import ProviderOptions from './ProviderOptions';

type SDKOptions = {
  dlts: DLTOptions[],
  provider?: ProviderOptions,
};

export default SDKOptions;
