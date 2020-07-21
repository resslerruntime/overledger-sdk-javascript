# Treaty Contract Example

As Overledger connects to multiple DLTs, it allows developers to start building multi-chain applications (MAPPs). A MAPP contains one or more treaty contracts, which detail the multi-chain logic. It is useful to think that a treaty contract is to a MAPP what a smart contract is to a DAPP. 

Note that MAPPs can also have a private database, personal to each stakeholder running the MAPP instance, as well as the capability to communicate with other MAPP instances if off-chain data needs to be passed. Of course a MAPP will have functions that are not specifically to do with the multi-chain logic (but some of these functions may call a Treaty Contract's interface). Finally a MAPP will have a user instance for 1 or more users to use.


## Treaty Contract Introduction

A Treaty Contract details the rules of interaction between the multiple DLTs, i.e. it contains the multi-distributed ledger logic. It can be written in any language, instantiated and shared between multiple participants and be run in many locations at the same time.

If a Treaty Contract is run in a single location, we have no problem with data consistency and availability, as everything required is in that single location. Alternatively we may want to run a Treaty Contract in multiple locations (for reasons such as its users may not trust a central authority to run the Treaty Contract, or more redundancy is required). In this case, there may be n instances of a single Treaty Contract. 

To keep multiple instances of a single Treaty Contract in sync, either (a) the Treaty Contract code has to be stateless (because all state variables are stored/referenced either on a DL that sorts out the consensus on chain or privately in the MAPPs database as we will discuss) OR (b) we have to find a solution to make a Treaty Contract stateful and for the n instances for the Treaty Contract to come to an agreement on the state without requiring our own distributed ledger. Our research indicates that the only viable way to do this without re-creating another distributed ledger is to implement the Treaty Contract in a distributed ledger.

We say that a Treaty Contract is trustless if it has the properties of:

[i] verifiable correctness: there is a method to check that the Treaty Contract instance stakeholders are running have the same code base; and

[ii] eventual data consistency: all verified instances of the same Treaty Contract will eventually return the same result for any specific function call with the same input (given no further changes to the underlying state variables).

Note that the Treaty Contract in this example is stateless.

## This Treaty Contract Example Use Case

This a simple non-atomic cross chain swap example.
Two parties are involved in this example. `Party A` owning ETH amount and `Party B` owning XRP. `Party A` wants to exchange X ETH against Y XRP from `Party B`. The X ETH from `Party A` are then escrowed by a smart contract. They will be unlocked by `Party B` once `Party B` has sent the Y XRP to `Party A`.


# Components

* `DLT`s: `Ethereum` and `XRP` Ledger.

* `Smart Contract (SC)`: Smart Contract in the Ethereum Ledger. It locks up the ETH to be swapped against XRP. It is written in Solidity.

* `Treaty Contract (TC)`: A Treaty Contract details the rules of interaction between the multiple DLTs, i.e. it contains the multi-distributed ledger logic. It can be written in any language, instantiated and shared between multiple participants and be run in many locations at the same time. It can call directly the DLT node (Ethereum or XRP) or the `SC`. It is written in Javascript/Node.js.

* `ETH`: assets exchanged with XRP.

* `OL`: Overledger to retrieve transactions data.

# Parties

* `Party A`: it runs an `TC` and owns ETH. It needs first an Ethereum account with ETH set in `PartyA.js` file

   ```
    const ethPrivateKey = '...';
    const ethAddress = '...';
    ```
    It also needs a XRP address that will be used by `PartyB` to send the XRP amount to. This address is set in `PartyB.js` file

    ```
    const xrpReceiverAddress = '...';
    ```


* `Party B`: it runs an `TC` and owns XRP. It needs an XRP and Ethereum accounts set in `PartyB.js` file 

```
const ethPrivateKey = '...';
const ethAddress = '...';
```

```
const xrpPrivateKey = '...';
const xrpAddress = '...';
```

The Ethereum address of `Party B` will be used by `Party A` to initiate the swap. It is set in `PartyA.js` file

```
const receiverAddress = '...';
```


* `Party A` swaps ETH with `Party B` XRP.


# Technical description

## PARTY A

* `Party A` initialises the swap 

* If the smart contract is already deployed, `Party A` does not need to deploy it again. The `redeploy` in `initialiseSmartContract` can then be set to `false`.

* The latest smart contract deployed on the MAPP is retrieved from `OL` transactions belonging to the mappId.

* If it is not deployed, the smart contract is deployed by calling his constructor with the treaty contract hash for argument.

* Initiate the request: Having a contract address deployed, it initialises the swap by calling `initiateRequest` function of the smart contract through the `initialiseSmartContract` Treaty Contract endpoint.
 This creates an ethereum transaction from `Party A` to the smart contract with the ETH amount that will be unlocked later by `Party B`. ETH amount is now locked by the smart contract.
 * By initiating a new request, the counter set in the smart contract is increased and all the stored data on the smart contract is retrieved by calling the getters of the smart contract, passing the request id number for argument.

## PARTY B

* Finalise the request: `Party B` waits for a new request creation and when it finds it, sends XRP to `PartyA` and call the `finaliseRequest` function of the smart contract through the `finaliseRequest` Treaty Contract endpoint to unlock the ETH amount that will be then transferred to `PartyB`.



## Running the Treaty Contract

* A MappId/bpiKey on `testnet` environment are needed to run the example on `OL testnet`. They should be set in the `treaty-contract.js` file:

```
const overledgerMappId = '...';
const OverledgerBpiKey = '...;
const network = "testnet";
```

* If you need to install packages related to this example, run:

```
yarn add NAME_OF_PACKAGE

```
`crypto-js` package must be installed.

* Run the Treaty Contract giving a port number that will be used in both files `PartyA.js` and `PartyB.js` under the variable `treatyContractUrl`.

 ```
 node treaty-contract.js PORT_NUMBER
 ```

For example, if PORT_NUMBER is set to `4000`, then the Treaty Contract URL has to be set in both party flows to:

```
const treatyContractUrl = "http://localhost:4000";
``` 

* Once the Treaty Contract is running, launch `PartyA` client. 

```
node PartyFlows/PartyA.js
```

 `PartyA` will first deploy or redeploy the smart contract if `redeploy` is set to `true` or retrieve the latest deployed smart contract from `OL`. When this request is finished and successful, `PartyA` will start by initiating a new request.

 * Once the smart contract is deployed or retrieved and the response is returned back (`****INIT NEW REQUEST****` of the following request on `PartyA` is then displayed), launch `PartyB` client.

 ```
 node PartyFlows/PartyB.js
 ```









