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

A COUPLE OF SENTENCES ON THE USE CASE OF THIS EXAMPLE - MENTION THAT THIS IS A SIMPLE NON-ATOMIC CROSS CHAIN SWAP

## Running the Treaty Contract

HOW DO USERS RUN IT? IS THERE ARE DEPENDANCIES ON RUNNING IT? E.G. DONT THEY HAVE TO INSTALL THE SDK??? DON'T THEY NEED A MAPPID/BPIKEY?? (DON'T EXPOSE OURS!)


## Interacting with the Treaty Contract

To simulate a MAPP using this example treaty contract, we have provided two scripts, partyA.js and partyB.js CHECK NAME. 

HOW DO USERS RUN IT? IS THERE DEPENDANCIES ON RUNNING? E.G. AS WELL AS SDK THEY NEED ETH AND XRP TESTNET KEYS RIGHT??? -> OR I GUESS PROVIDING THEM SOME DUMMY WELL FUNDED ONES WILL BE OK???

ALSO LIST THE BASIC FLOW. E.G. PARTY A CALLS TC FUNCTION A TO REGISTER A REQUEST & TRANSFER ETH.... ETC




