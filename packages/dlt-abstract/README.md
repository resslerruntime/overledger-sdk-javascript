# @overledger/dlt-abstract

Abstract class for dlt functions.

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @overledger/dlt-abstract
```

Or, if you prefer using [yarn](https://yarnpkg.com/):

```
yarn add @overledger/dlt-abstract
```

## API Reference

## Modules

<dl>
<dt><a href="#module_dlt-abstract">dlt-abstract</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#AbstractDLT">AbstractDLT</a></dt>
<dd></dd>
</dl>

<a name="module_dlt-abstract"></a>

## dlt-abstract
<a name="AbstractDLT"></a>

## AbstractDLT

* [AbstractDLT](#AbstractDLT)

    * [new AbstractDLT(sdk, options)](#new_AbstractDLT_new)

    * [.getBalance(address)](#AbstractDLT+getBalance)

    * [.getSequence(address)](#AbstractDLT+getSequence)

    * [.sign(toAddress, message, options)](#AbstractDLT+sign)

    * [.send(signedTransaction)](#AbstractDLT+send)

    * [.buildSignedTransactionsApiCall(signedTransaction)](#AbstractDLT+buildSignedTransactionsApiCall)


<a name="new_AbstractDLT_new"></a>

### new AbstractDLT(sdk, options)

| Param | Type |
| --- | --- |
| sdk | <code>any</code> | 
| options | <code>Object</code> | 

<a name="AbstractDLT+getBalance"></a>

### *abstractDLT*.getBalance(address)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| address | <code>string</code> | <code>null</code> | The address to query for |

Get the balance for a specific address

<a name="AbstractDLT+getSequence"></a>

### *abstractDLT*.getSequence(address)

| Param | Type |
| --- | --- |
| address | <code>string</code> \| <code>Array.&lt;string&gt;</code> | 

Get the sequence for a specific address

<a name="AbstractDLT+sign"></a>

### *abstractDLT*.sign(toAddress, message, options)

| Param | Type |
| --- | --- |
| toAddress | <code>string</code> | 
| message | <code>string</code> | 
| options | <code>TransactionOptions</code> | 

Sign a transaction for the DLT

<a name="AbstractDLT+send"></a>

### *abstractDLT*.send(signedTransaction)

| Param | Type |
| --- | --- |
| signedTransaction | <code>SignedTransactionRequest</code> | 

Send an Overledger signed transaction

<a name="AbstractDLT+buildSignedTransactionsApiCall"></a>

### *abstractDLT*.buildSignedTransactionsApiCall(signedTransaction)

| Param | Type |
| --- | --- |
| signedTransaction | <code>SignedTransactionRequest</code> | 

Wrap a specific DLT signed transaction with the Overledger required fields

