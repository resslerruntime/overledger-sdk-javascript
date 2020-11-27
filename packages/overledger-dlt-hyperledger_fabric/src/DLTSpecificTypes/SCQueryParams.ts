import SCHyperledgerFabricParam from './SCHyperledgerFabricParam';

/**
 * A generic object to describe an HyperledgerFabric smart contract query. 
* @typedef {Object} SCQueryParams
* @property {string} fromAddress - who sent the query
* @property {string} contractAddress - the smart contract the query made to
* @property {string} functionName - the smart contract function called to invoke the query
* @property {SCHyperledgerFabricParam[]} inputValues - the input params of this function
* @property {SCHyperledgerFabricParam[]} outputTypes - the output params of this function
*/

/**
 * @memberof module:overledger-dlt-hyperledger_fabric
 */
interface SCQueryParams {
  fromAddress: string;
  contractAddress: string;
  functionName: string;
  inputValues: SCHyperledgerFabricParam[];
  outputTypes: SCHyperledgerFabricParam[];
}

export default SCQueryParams;
