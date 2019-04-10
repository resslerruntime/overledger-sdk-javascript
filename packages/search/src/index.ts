import { AxiosInstance, AxiosPromise } from 'axios';
import { OverledgerSDK } from '@overledger/types';

class Search {
  sdk: OverledgerSDK;
  request: AxiosInstance;

  /**
   * @param {Object} sdk
   */
  constructor(sdk: OverledgerSDK) {
    this.sdk = sdk;
    this.request = this.sdk.provider.createRequest('/search');
  }

  /**
   * Get transaction by a transaction hash (non-deterministic)
   *
   * @param {string} transactionHash Transaction hash
   */
  getTransaction(transactionHash: string): AxiosPromise {
    try {
      return this.request.get(`/transactions/${transactionHash}`);
    } catch (e) {
      return e.response;
    }
  }

  /**
   * Get whoami
   *
   * @param {string} hash hash
   */
  whoami(hash: string): AxiosPromise {
    try {
      return this.request.get(`/whoami/${hash}`);
    } catch (e) {
      return e.response;
    }
  }

  /**
   * Get block hash
   *
   * @param {string} dlt the DLT name
   * @param {string} hash block hash
   */
  getBlockByDltAndHash(dlt: string, hash: string): AxiosPromise {
    try {
      return this.request.get(`/${dlt}/blocks/${hash}`);
    } catch (e) {
      return e.response;
    }
  }

  /**
   * Get block number
   *
   * @param {string} dlt the DLT name
   * @param {number} blockNumber block number
   */
  getBlockByDltAndNumber(dlt: string, blockNumber: number): AxiosPromise {
    try {
      return this.request.get(`/${dlt}/blocks/${blockNumber}`);
    } catch (e) {
      return e.response;
    }
  }
}

export default Search;
