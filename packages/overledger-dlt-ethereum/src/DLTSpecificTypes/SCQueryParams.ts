import SCEthereumParam from './SCEthereumParam';

/**
 * A generic object to describe an Ethereum smart contract query. 
* @typedef {Object} SCQueryParams
* @property {string} fromAddress - who sent the query
* @property {string} contractAddress - the smart contract the query made to
* @property {string} functionName - the smart contract function called to invoke the query
* @property {SCEthereumParam[]} inputValues - the input params of this function
* @property {SCEthereumParam[]} outputTypes - the output params of this function
*/

/**
 * @memberof module:overledger-dlt-ethereum
 */
interface SCQueryParams {
  fromAddress: string;
  contractAddress: string;
  functionName: string;
  inputValues: SCEthereumParam[];
  outputTypes: SCEthereumParam[];
}

export default SCQueryParams;
