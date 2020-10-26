import { SmartContract } from '@quantnetwork/overledger-types';

/**
 * A generic object to describe an Corda smart contract. Note that this object inherits many parameters from SmartContract.
 * @typedef {Object} SmartContractCorda
 */

/**
 * @memberof module:overledger-dlt-corda
 */
interface SmartContractCorda extends SmartContract {
  extraFields: {
    //to add later
  };
}

export default SmartContractCorda;
