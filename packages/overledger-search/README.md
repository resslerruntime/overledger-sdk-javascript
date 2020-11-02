[docs]: https://github.com/quantnetwork/overledger-sdk-javascript/blob/master/README.md
[repo]: https://github.com/quantnetwork/overledger-sdk-javascript

# @quantnetwork/overledger-search

Class encompassing [Overledger SDK][repo] search functions.

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @quantnetwork/overledger-search
```

Or, if you prefer using [yarn](https://yarnpkg.com/):

```
yarn add @quantnetwork/overledger-search
```

## API Reference

<a name="module_overledger-search"></a>

## overledger-search

* [overledger-search](#module_overledger-search)

    * _static_
        * [.default](#module_overledger-search.default)

    * _inner_
        * [~OverledgerSearch](#module_overledger-search.OverledgerSearch)

            * [new OverledgerSearch(sdk)](#new_module_overledger-search.OverledgerSearch_new)

            * [.getTransaction(transactionHash, dlt, extraFields)](#module_overledger-search.OverledgerSearch+getTransaction)

            * [.getTransactionType(hash)](#module_overledger-search.OverledgerSearch+getTransactionType)

            * [.getBlockByDltAndNumber(dlt, blockNumber)](#module_overledger-search.OverledgerSearch+getBlockByDltAndNumber)

            * [.getBlockHeightByDlt(dlt)](#module_overledger-search.OverledgerSearch+getBlockHeightByDlt)

            * [.getBlockByDltAndHash(dlt, hash)](#module_overledger-search.OverledgerSearch+getBlockByDltAndHash)

            * [.smartContractQuery(dlt, contractQueryDetails)](#module_overledger-search.OverledgerSearch+smartContractQuery)


<a name="module_overledger-search.default"></a>

### *overledger-search*.default
Search support package.

<a name="module_overledger-search.OverledgerSearch"></a>

### *overledger-search*~OverledgerSearch

* [~OverledgerSearch](#module_overledger-search.OverledgerSearch)

    * [new OverledgerSearch(sdk)](#new_module_overledger-search.OverledgerSearch_new)

    * [.getTransaction(transactionHash, dlt, extraFields)](#module_overledger-search.OverledgerSearch+getTransaction)

    * [.getTransactionType(hash)](#module_overledger-search.OverledgerSearch+getTransactionType)

    * [.getBlockByDltAndNumber(dlt, blockNumber)](#module_overledger-search.OverledgerSearch+getBlockByDltAndNumber)

    * [.getBlockHeightByDlt(dlt)](#module_overledger-search.OverledgerSearch+getBlockHeightByDlt)

    * [.getBlockByDltAndHash(dlt, hash)](#module_overledger-search.OverledgerSearch+getBlockByDltAndHash)

    * [.smartContractQuery(dlt, contractQueryDetails)](#module_overledger-search.OverledgerSearch+smartContractQuery)


<a name="new_module_overledger-search.OverledgerSearch_new"></a>

#### new OverledgerSearch(sdk)

| Param | Type |
| --- | --- |
| sdk | <code>Object</code> | 

<a name="module_overledger-search.OverledgerSearch+getTransaction"></a>

#### *overledgerSearch*.getTransaction(transactionHash, dlt, extraFields)

| Param | Type | Description |
| --- | --- | --- |
| transactionHash | <code>string</code> | Transaction hash |
| dlt | <code>string</code> | the dlt that the transactionHash resides on *Optional* |
| extraFields | <code>string</code> | any extra fields required to perform this transaction search *Optional* |

Get transaction by transaction hash

<a name="module_overledger-search.OverledgerSearch+getTransactionType"></a>

#### *overledgerSearch*.getTransactionType(hash)

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | hash |

Get the transaction type based on the hash

<a name="module_overledger-search.OverledgerSearch+getBlockByDltAndNumber"></a>

#### *overledgerSearch*.getBlockByDltAndNumber(dlt, blockNumber)

| Param | Type | Description |
| --- | --- | --- |
| dlt | <code>string</code> | The DLT name |
| blockNumber | <code>number</code> | The block number |

Get block by DLT and number

<a name="module_overledger-search.OverledgerSearch+getBlockHeightByDlt"></a>

#### *overledgerSearch*.getBlockHeightByDlt(dlt)

| Param | Type | Description |
| --- | --- | --- |
| dlt | <code>string</code> | The DLT name |

Get block by DLT and number

<a name="module_overledger-search.OverledgerSearch+getBlockByDltAndHash"></a>

#### *overledgerSearch*.getBlockByDltAndHash(dlt, hash)

| Param | Type | Description |
| --- | --- | --- |
| dlt | <code>string</code> | The DLT name |
| hash | <code>string</code> | The block hash |

Get block by DLT and hash

<a name="module_overledger-search.OverledgerSearch+smartContractQuery"></a>

#### *overledgerSearch*.smartContractQuery(dlt, contractQueryDetails)

| Param | Description |
| --- | --- |
| dlt | the distributed ledger that this smart contract is on |
| contractQueryDetails | details on this smart contract query |

Query a smart contract

