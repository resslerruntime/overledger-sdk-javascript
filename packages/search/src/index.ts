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
  async getTransaction(transactionHash) {
    try {
      const response = await this.request.get(`/transactions/${transactionHash}`);
      return response;
    } catch (e) {
      return e.response;
    }
  }

  /**
   * Get whoami
   *
   * @param {string} hash hash
   */
  async whoami(hash) {
    try {
      const response = await this.request.get(`/whoami/${hash}`);
      return response;
    } catch (e) {
      return e.response;
    }
  }

  /**
   * Get block hash
   *
   * @param {string} hash block hash
   */
  async getBlockByDltAndHash(dlt, hash) {
    try {
      const response = await this.request.get(`/chains/${dlt}/blocks/byHash/${hash}`);
      return response;
    } catch (e) {
      return e.response;
    }
  }

  /**
   * Get block number
   *
   * @param {number} blockNumber block number
   */
  async getBlockByDltAndNumber(dlt, blockNumber) {
    try {
      const response = await this.request.get(`/chains/${dlt}/blocks/byNumber/${blockNumber}`);
      return response;
    } catch (e) {
      return e.response;
    }
  }
}

export default Search;
