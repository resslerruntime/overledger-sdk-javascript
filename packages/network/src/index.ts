import axios, { AxiosInstance } from "axios";
import { SDKOptions } from "@overledger/types";

/**
 * Configure the provided options
 *
 * @param {Object} options
 */
function request(mappId: string, bpiKey: string, options: SDKOptions): AxiosInstance {
  let network = options.network || 'testnet';
  let overledgerUri: string;

  if (network === 'mainnet') {
    overledgerUri = "https://bpi.overledger.io/v1";
  } else {
    overledgerUri = "https://bpi.testnet.overledger.io/v1";
  }

  let request = axios.create({
    baseURL: overledgerUri,
    timeout: options.timeout || 5000,
    headers: {
      Authorization: `Bearer ${mappId}:${bpiKey}`
    }
  });

  return request;
}

export default request;
