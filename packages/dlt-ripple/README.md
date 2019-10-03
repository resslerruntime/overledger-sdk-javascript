# @overledger/dlt-ripple

Module for interaction with the Ripple distributed ledger technology.

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @overledger/dlt-ripple
```

Or, if you prefer using [yarn](https://yarnpkg.com/):

```
yarn add @overledger/dlt-ripple
```

## API Reference

## Modules

<dl>
<dt><a href="#module_dlt-ripple">dlt-ripple</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#Ripple">Ripple</a></dt>
<dd></dd>
</dl>

<a name="module_dlt-ripple"></a>

## dlt-ripple
<a name="module_dlt-ripple.default"></a>

### *dlt-ripple*.default
Development package for Ripple (XRP Ledger).

<a name="Ripple"></a>

## Ripple

* [Ripple](#Ripple)

    * [new Ripple(sdk, options)](#new_Ripple_new)

    * [.name](#Ripple+name)

    * [.symbol](#Ripple+symbol)

    * [.createAccount()](#Ripple+createAccount)

    * [.setAccount(privateKey)](#Ripple+setAccount)

    * [.buildTransaction(toAddress, message, options)](#Ripple+buildTransaction)

    * [._sign(toAddress, message, options)](#Ripple+_sign)


<a name="new_Ripple_new"></a>

### new Ripple(sdk, options)

| Param | Type |
| --- | --- |
| sdk | <code>any</code> | 
| options | <code>Object</code> | 

<a name="Ripple+name"></a>

### *ripple*.name
Name of the DLT

<a name="Ripple+symbol"></a>

### *ripple*.symbol
Symbol of the DLT

<a name="Ripple+createAccount"></a>

### *ripple*.createAccount()
Create an account for a specific DLT

<a name="Ripple+setAccount"></a>

### *ripple*.setAccount(privateKey)

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | The privateKey |

Set an account for signing for a specific DLT

<a name="Ripple+buildTransaction"></a>

### *ripple*.buildTransaction(toAddress, message, options)

| Param | Type |
| --- | --- |
| toAddress | <code>string</code> | 
| message | <code>string</code> | 
| options | <code>TransactionOptions</code> | 

Build the transaction

<a name="Ripple+_sign"></a>

### *ripple*._sign(toAddress, message, options)

| Param | Type |
| --- | --- |
| toAddress | <code>string</code> | 
| message | <code>string</code> | 
| options | <code>TransactionOptions</code> | 

Sign the transaction

