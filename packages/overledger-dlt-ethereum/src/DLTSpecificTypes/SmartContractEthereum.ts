import {SmartContract} from "@quantnetwork/overledger-types";

/**
 * A generic object to describe an Ethereum smart contract. Note that this object inherits many parameters from SmartContract.
 * @typedef {Object} SmartContractEthereum
 * @property {boolean} payable - does this function have a payable function (interface) or are we calling a payable smart contrac function (functionCall)
 * @property {boolean} payableFunctions - the list of payable functions
 * @property {boolean} newDLTxRequired - which smart contract functions require new transactions to be added on the distributed ledger (i.e. which functions change the state of the ledger)
 */

/**
 * @memberof module:overledger-dlt-ethereum
 */ 
interface SmartContractEthereum extends SmartContract {
        extraFields: {
            payable: boolean,
            payableFunctions?: string[],
            newDLTxRequired?: string[]
        }
  };
  
  export default SmartContractEthereum;
  