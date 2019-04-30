import axios, { AxiosInstance } from 'axios';
import providerOptions from '@overledger/types/src/providerOptions';
import networkOptions from '@overledger/types/src/networkOptions';

export const TESTNET: networkOptions = 'testnet';
export const MAINNET: networkOptions = 'mainnet';

class Provider {
  mappId: string;
  bpiKey: string;
  options: providerOptions;
  network: networkOptions;

  constructor(mappId: string, bpiKey: string, options: providerOptions = {}) {
    this.mappId = mappId;
    this.bpiKey = bpiKey;
    this.options = options;
    this.network = this.options.network || TESTNET;
  }

  createRequest(path?: string): AxiosInstance {
    let overledgerUri: string;

    if (this.network === TESTNET) {
      overledgerUri = 'https://bpi.testnet.overledger.io/v1';
    } else if (this.network === MAINNET) {
      overledgerUri = 'https://bpi.overledger.io/v1';
    } else {
      overledgerUri = this.network;
    }

    const baseUrl: string = path ? overledgerUri + path : overledgerUri;

    return axios.create({
      baseURL: baseUrl,
      timeout: this.options.timeout || 5000,
      headers: {
        Authorization: `Bearer ${this.mappId}:${this.bpiKey}`,
        'Content-type': 'application/json',
      },
    });
  }
}

export default Provider;
