# Smart Contract Example

This example contains a script deploy a smart contract, a script to invoke a function of a smart contract and a script to read data from this smart contract.

## Building

In order to run the example, first, make sure you have built the SDK by running the following command in the root folder of the project:

```
yarn run build
```

## Running the Example

### Smart Contract Creation
For this example we will start by running a script, named `create-smart-contract.js` to create a smart contract. Just like the following scripts, before it is run you will need to initialise a few variables placed in the 'VARIABLES TO UPDATE' section. For this script you will need to set your mappId, BPI key, Ethereum address and Ethereum private key. Then you can run the script from the 'smart-contracts' directory:

```
node create-smart-contract.js
```
This will create and send a transaction through Overledger that will deploy a smart contract! This script is deploying the smart contract bytecode placed in the `smartContractDemoCode` variable onto the Ethereum blockchain (Ropsten testnet). This bytecode corresponds to the demoSmartContract.sol Solidity code.

Now that once you have created a transaction to deploy a smart contract, you will need to know it's assigned address before you can interact with it further. A smart contract is assigned an address upon transaction confirmation. You can find your assigned smart contract address through a variety of means, search as searching Etherscan (https://ropsten.etherscan.io/) for the smart contract creation transaction hash. The following examples have a pre-set smart contract address, from a previous deployment. 

### Smart Contract Read
 If a smart contract function does not change the state of the distributed ledger then another transaction is *not* required. Instead, the connected node's copy of the current state of the distributed ledger can be looked up. For an example of calling a smart contract function that only reads data, we provide the following script. Before it is run you will need to initialise a few variables placed in the 'VARIABLES TO UPDATE' section. For this script you will need to set a mappId, BPI key, and Ethereum address. Then you can run the script from the 'smart-contracts' directory:

```
node read-smart-contract.js
```

Finally, you may also want to call smart contract functions that change the state of the distributed ledger. To do so, a new transaction will have to be added onto the ledger. We have provided the following example script that does so. Again you will need to initialise a few variables placed in the 'VARIABLES TO UPDATE' section. For this script you will need to set your mappId, BPI key, Ethereum address and Ethereum private key.

```
node invoke-smart-contract.js
```