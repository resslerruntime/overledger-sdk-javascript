# @overledger/search

Class encompassing Overledger search functions.

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @overledger/search
```

Or, if you prefer using [yarn](https://yarnpkg.com/):

```
yarn add @overledger/search
```

## API Reference

## Modules

<dl>
<dt><a href="#module_search">search</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#OverledgerSearch">OverledgerSearch</a></dt>
<dd></dd>
</dl>

<a name="module_search"></a>

## search
<a name="OverledgerSearch"></a>

## OverledgerSearch

* [OverledgerSearch](#OverledgerSearch)

    * [new OverledgerSearch(sdk)](#new_OverledgerSearch_new)

    * [.getTransaction(transactionHash)](#OverledgerSearch+getTransaction)

    * [.getTransactionType(hash)](#OverledgerSearch+getTransactionType)

    * [.getBlockByDltAndNumber(dlt, blockNumber)](#OverledgerSearch+getBlockByDltAndNumber)

    * [.getBlockByDltAndHash(dlt, hash)](#OverledgerSearch+getBlockByDltAndHash)


<a name="new_OverledgerSearch_new"></a>

### new OverledgerSearch(sdk)

| Param | Type |
| --- | --- |
| sdk | <code>Object</code> | 

<a name="OverledgerSearch+getTransaction"></a>

### *overledgerSearch*.getTransaction(transactionHash)

| Param | Type | Description |
| --- | --- | --- |
| transactionHash | <code>string</code> | Transaction hash |

Get transaction by transaction hash (non-deterministic)

<a name="OverledgerSearch+getTransactionType"></a>

### *overledgerSearch*.getTransactionType(hash)

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | hash |

Get the transaction type based on the hash

<a name="OverledgerSearch+getBlockByDltAndNumber"></a>

### *overledgerSearch*.getBlockByDltAndNumber(dlt, blockNumber)

| Param | Type | Description |
| --- | --- | --- |
| dlt | <code>string</code> | The DLT name |
| blockNumber | <code>number</code> | The block number |

Get block by DLT and number

<a name="OverledgerSearch+getBlockByDltAndHash"></a>

### *overledgerSearch*.getBlockByDltAndHash(dlt, hash)

| Param | Type | Description |
| --- | --- | --- |
| dlt | <code>string</code> | The DLT name |
| hash | <code>string</code> | The block hash |

Get block by DLT and hash

