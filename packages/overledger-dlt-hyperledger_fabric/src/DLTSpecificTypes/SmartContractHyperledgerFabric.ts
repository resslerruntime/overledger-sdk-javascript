import { SmartContract } from '@quantnetwork/overledger-types';

/**
 * A generic object to describe an HyperledgerFabric smart contract. Note that this object inherits many parameters from SmartContract.
 * @typedef {Object} SmartContractHyperledgerFabric
 * @property {boolean} connectionProfileJSON - the connection profile to access the node
 * @property {boolean} channelName - the channel that this smart contract is on
 */

/**
 * @memberof module:overledger-dlt-hyperledger_fabric
 */
interface SmartContractHyperledgerFabric extends SmartContract {
  extraFields: {
    connectionProfileJSON: string,
    channelName: string,
  };
}

export default SmartContractHyperledgerFabric;
