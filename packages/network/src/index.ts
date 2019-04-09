import axios, { AxiosInstance } from 'axios';
import { SDKOptions } from '@overledger/types';

const TESTNET: string = 'testnet';
const MAINNET: string = 'mainnet';

/**
 * Configure the provided options
 *
 * @param {Object} options
 */
function request(mappId: string, bpiKey: string, options: SDKOptions): AxiosInstance {
  const network = options.network || TESTNET;
  let overledgerUri: string;

  if (network === TESTNET) {
    overledgerUri = 'https://bpi.testnet.overledger.io/v1';
  } else if (network === MAINNET) {
    overledgerUri = 'https://bpi.overledger.io/v1';
  } else {
    overledgerUri = network;
  }

  return axios.create({
    baseURL: overledgerUri,
    timeout: options.timeout || 5000,
    headers: {
      Authorization: `Bearer ${mappId}:${bpiKey}`,
    },
  });
}

export default request;
