import DLTOptions from './DLTOptions';

type SDKOptions = {
  dlts: DLTOptions[],
  network?: 'mainnet' | 'testnet',
  timeout?: number,
};

export default SDKOptions;
