import DLTOptions from './DLTOptions';
import providerOptions from './providerOptions';

type SDKOptions = {
  dlts: DLTOptions[],
  provider?: providerOptions,
};

export default SDKOptions;
