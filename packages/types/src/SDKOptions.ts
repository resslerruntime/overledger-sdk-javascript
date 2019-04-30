import DLTOptions from './DLTOptions';
import providerOptions from './ProviderOptions';

type SDKOptions = {
  dlts: DLTOptions[],
  provider?: providerOptions,
};

export default SDKOptions;
