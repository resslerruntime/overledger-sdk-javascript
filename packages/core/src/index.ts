import { AxiosInstance, AxiosPromise } from 'axios';
import Search from '@overledger/search';
import Provider from '@overledger/provider';
import { APICall, AbstractDLT, SDKOptions, DLTOptions, SignOptions, SignedTransactionResponse, SequenceDataRequest, APICallWrapper } from '@overledger/types';
import colors from 'colors';
import networkOptions from '@overledger/types/src/networkOptions';

class OverledgerSDK {
  /**
   * The object storing the DLTs loaded by the Overledger sdk
   */
  dlts: { [key: string]: AbstractDLT } = {};

  mappId: string;
  bpiKey: string;
  network: networkOptions;
  provider: any; // TODO: define the type
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
    this.network = options.provider && options.provider.network || 'testnet';

    this.validateOptions(options);

    options.dlts.forEach((dltConfig: DLTOptions) => {
      const dlt = this.loadDlt(dltConfig);
      this.dlts[dlt.name] = dlt;
    });

    this.provider = new Provider(mappId, bpiKey, options.provider);
    this.request = this.provider.createRequest();
    this.search = new Search(this);
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
    const dltName = `dlt-${config.dlt}`;
    try {
      const provider = require(`@overledger/${dltName}`).default;

      return new provider(this, config);
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        console.log(colors.red(`Could not find the package for this DLT. Please install @overledger/${dltName} manually`));
        process.exit(1);
        return;
      }
    }
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
