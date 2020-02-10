# Smart Contract Example

This example contains a script deploy a smart contract, a script to invoke a function of a smart contract and a script to read data from this smart contract.

## Building

In order to run the example, first, make sure you have built the SDK by running the following command in the root folder of the project:

```
yarn run build
```

## Running the example

Each script has a section at the beginning where a few variables need to be initialised. First, set a mappId, BPI key, Ethereum address and Ethereum private key in every script. Then you can run your first script from the 'smart-contracts' directory:

```
node create-smart-contract.js
```
This will deploy your first smart contract through Overledger! This script is deploying the bytecode of the demoSmartContract.sol Solidity smart contract code onto the Ethereum blockchain (Ropsten testnet).

Now that you have deployed a smart contract, you can call its functions. If a smart contract function does not change the state of the distributed ledger than another transaction is *not* required. Instead the connected node's copy of the current state of the distributed ledger can be looked up. For an example of calling a smart contract function that only reads data we provide the following script. Make sure to first set in the script the mappId, BPI key, Ethereum address, Ethereum private key *and* the address of the contract that you just deployed with the previous script. This contract address can be querying the transaction...

```
node read-smart-contract.js
```

Finally, you will also want to call smart contract functions that change the state of the distributed ledger. To do so, a new transaction will have to be added onto the ledger. We have provided the following example script that does so. Again remember to set in the script the mappId, BPI key, Ethereum address, Ethereum private key *and* the address of the smart contract.

```
node invoke-smart-contract.js
```