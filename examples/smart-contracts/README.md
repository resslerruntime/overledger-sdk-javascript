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
This will deploy your first smart contract through Overledger! This script is deploying the bytecode of the demoSmartContract.sol Solidity smart contract code onto the Ethereum blockchain.

```
node get-address-sequence.js
```

The first command will print the balances of the addresses declared, while the second one will print the sequences of those addresses.