import axios, { AxiosInstance, AxiosPromise } from 'axios';
import Search from '@overledger/search';
import { APICall, AbstractDLT, SDKOptions, DLTOptions, SignOptions, SignedTransactionResponse, SequenceDataRequest, APICallWrapper } from '@overledger/types';

class OverledgerSDK {
  TESTNET: string = 'testnet';

  MAINNET: string = 'mainnet';

  /**
   * The object storing the DLTs loaded by the Overledger sdk
   */
  dlts = {};

  overledgerUri: string;
  mappId: string;
  bpiKey: string;
  network: string;
  request: AxiosInstance;

  search: Search;

  /**
   * @param {string} mappId
   * @param {string} bpiKey
   * @param {Object} options
   */
  constructor(mappId: string, bpiKey: string, options: SDKOptions) {
    this.mappId = mappId;
    this.bpiKey = bpiKey;

    this.validateOptions(options);
    this.configure(options);
  }

  /**
   * Validate the provided options
   *
   * @param {Object} options
   */
  private validateOptions(options: SDKOptions): void {
    if (!options.dlts) {
      throw new Error('The dlts are missing');
    }
  }

  /**
   * Configure the provided options
   *
   * @param {Object} options
   */
  private configure(options: SDKOptions): void {
    options.dlts.forEach((dltConfig: DLTOptions) => {
      const dlt = this.loadDlt(dltConfig);
      this.dlts[dlt.name] = dlt;
    });

    this.network = options.network || this.TESTNET;

    if (this.network === this.MAINNET) {
      this.overledgerUri = 'https://bpi.overledger.io/v1';
    } else {
      this.overledgerUri = 'https://bpi.testnet.overledger.io/v1';
    }

    this.request = axios.create({
      baseURL: this.overledgerUri,
      timeout: options.timeout || 5000,
      headers: {
        Authorization: `Bearer ${this.mappId}:${this.bpiKey}`,
      },
    });

    this.search = new Search(this, options);
  }

  /**
   * Sign transactions for the provided DLTs
   *
   * @param {Object} dlts Object of the DLTs where you want to send a transaction
   */
  public async sign(dlts: SignOptions): Promise<SignedTransactionResponse[]> {
    if (!Array.isArray(dlts)) {
      throw new Error('The dlts object must be an array');
    }

    return Promise.all(dlts.map(async (dlt) => {
      return {
        dlt: dlt.dlt,
        signedTransaction: await this.dlts[dlt.dlt].sign(dlt.toAddress, dlt.message, dlt.options),
      };
    }));
  }

  /**
   * Wrap the DLTData with the api schema
   *
   * @param {array} dltData
   */
  private buildWrapperApiCall(dltData: APICall[] | SequenceDataRequest[]): APICallWrapper {
    return {
      dltData,
      mappId: this.mappId,
    };
  }

  /**
   * Send signed transactions to the provided DLTs
   *
   * @param {Object} signedTransactions Object of the DLTs where you want to send a transaction
   */
  public send(signedTransactions): AxiosPromise<Object> {
    const apiCall = signedTransactions.map(
      dlt => this.dlts[dlt.dlt].buildSignedTransactionsApiCall(dlt.signedTransaction),
    );

    return this.request.post('/transactions', this.buildWrapperApiCall(apiCall));
  }

  /**
   * Get the sequence number from the provided address
   *
   * @param {Object} signedTransactions Object of the DLTs where you want to send a transaction
   */
  public getSequences(sequenceData: SequenceDataRequest[]): AxiosPromise<Object> {
    return this.request.post('/sequence', this.buildWrapperApiCall(sequenceData));
  }

  /**
   * Load the dlt to the Overledger SDK
   *
   * @param {Object} config
   *
   * @return {Provider}
   */
  private loadDlt(config: DLTOptions): AbstractDLT {
    // Need to improve this loading
    let dltName = config.dlt.charAt(0).toUpperCase() + config.dlt.slice(1);
    const Provider = require(`../../${config.dlt}/src/dlts/${dltName}`).default;

    return new Provider(this, config);
  }

  /**
   * Read by mapp id
   */
  public readTransactionsByMappId(): AxiosPromise<Object> {
    return this.request.get(`/transactions/mappid/${this.mappId}`);
  }

  /**
   * read by overledger transaction id
   *
   * @param {string} ovlTransactionId
   */
  public readByTransactionId(ovlTransactionId: string): AxiosPromise<Object> {
    return this.request.get(`/transactions/id/${ovlTransactionId}`);
  }

  /**
   * Set the mapp id
   *
   * @param {string} mappId
   */
  public setMappId(mappId: string): void {
    this.mappId = mappId;
  }

  /**
   * get the mapp id
   */
  public getMappId(): string {
    return this.mappId;
  }

  /**
   * set the bpi key
   *
   * @param {string} bpiKey
   */
  public setBpiKey(bpiKey: string): void {
    this.bpiKey = bpiKey;
  }

  /**
   * get the bpi key
   */
  public getBpiKey(): string {
    return this.bpiKey;
  }

  public getBalances(array): AxiosPromise<Object> {

    return this.request.post('/balances', array);
  }
}

export default OverledgerSDK;
