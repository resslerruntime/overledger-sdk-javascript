# @overledger/dlt-ethereum

Module for interaction with the Ethereum distributed ledger technology.

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @overledger/dlt-ethereum
```

Or, if you prefer using [yarn](https://yarnpkg.com/):

```
yarn add @overledger/dlt-ethereum
```

## API Reference

## Modules

<dl>
<dt><a href="#module_dlt-ethereum">dlt-ethereum</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#Ethereum">Ethereum</a></dt>
<dd></dd>
</dl>

<a name="module_dlt-ethereum"></a>

## dlt-ethereum
<a name="module_dlt-ethereum.default"></a>

### *dlt-ethereum*.default
Development package for Ethereum.

<a name="Ethereum"></a>

## Ethereum

* [Ethereum](#Ethereum)

    * [new Ethereum(sdk, options)](#new_Ethereum_new)

    * [.name](#Ethereum+name)

    * [.symbol](#Ethereum+symbol)

    * [.createAccount()](#Ethereum+createAccount)

    * [.setAccount(privateKey)](#Ethereum+setAccount)

    * [.buildTransaction(toAddress, message, options)](#Ethereum+buildTransaction)

    * [._sign(toAddress, message, options)](#Ethereum+_sign)


<a name="new_Ethereum_new"></a>

### new Ethereum(sdk, options)

| Param | Type |
| --- | --- |
| sdk | <code>any</code> | 
| options | <code>Object</code> | 

<a name="Ethereum+name"></a>

### *ethereum*.name
Name of the DLT

<a name="Ethereum+symbol"></a>

### *ethereum*.symbol
Symbol of the DLT

<a name="Ethereum+createAccount"></a>

### *ethereum*.createAccount()
Create an account for a specific DLT

<a name="Ethereum+setAccount"></a>

### *ethereum*.setAccount(privateKey)

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | The privateKey |

Set an account for signing transactions for a specific DLT

<a name="Ethereum+buildTransaction"></a>

### *ethereum*.buildTransaction(toAddress, message, options)

| Param | Type |
| --- | --- |
| toAddress | <code>string</code> | 
| message | <code>string</code> | 
| options | <code>TransactionOptions</code> | 

Build the transaction

<a name="Ethereum+_sign"></a>

### *ethereum*._sign(toAddress, message, options)

| Param | Type |
| --- | --- |
| toAddress | <code>string</code> | 
| message | <code>string</code> | 
| options | <code>TransactionOptions</code> | 

Sign the transaction

