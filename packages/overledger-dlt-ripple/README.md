[docs]: https://github.com/quantnetwork/overledger-sdk-javascript/blob/master/README.md
[repo]: https://github.com/quantnetwork/overledger-sdk-javascript

# @quantnetwork/overledger-dlt-ripple

[Overledger SDK][repo] module for interaction with the Ripple distributed ledger technology.

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @quantnetwork/overledger-dlt-ripple
```

Or, if you prefer using [yarn](https://yarnpkg.com/):

```
yarn add @quantnetwork/overledger-dlt-ripple
```

## API Reference

<a name="module_overledger-dlt-ripple"></a>

## overledger-dlt-ripple

* [overledger-dlt-ripple](#module_overledger-dlt-ripple)

    * _static_
        * [.default](#module_overledger-dlt-ripple.default)

    * _inner_
        * [~Ripple](#module_overledger-dlt-ripple.Ripple)

            * [new Ripple(sdk, options)](#new_module_overledger-dlt-ripple.Ripple_new)

            * [.name](#module_overledger-dlt-ripple.Ripple+name)

            * [.symbol](#module_overledger-dlt-ripple.Ripple+symbol)

            * [.createAccount()](#module_overledger-dlt-ripple.Ripple+createAccount)

            * [.setAccount(privateKey)](#module_overledger-dlt-ripple.Ripple+setAccount)

            * [.buildTransaction(thisTransaction)](#module_overledger-dlt-ripple.Ripple+buildTransaction)

            * [._transactionValidation(thisTransaction)](#module_overledger-dlt-ripple.Ripple+_transactionValidation)

            * [._sign(thisTransaction)](#module_overledger-dlt-ripple.Ripple+_sign)

            * [._buildSmartContractQuery(dltAddress, contractQueryDetails)](#module_overledger-dlt-ripple.Ripple+_buildSmartContractQuery)

            * [._smartContractQueryValidation(contractQueryDetails)](#module_overledger-dlt-ripple.Ripple+_smartContractQueryValidation)


<a name="module_overledger-dlt-ripple.default"></a>

### *overledger-dlt-ripple*.default
Development package for Ripple (XRP Ledger).

<a name="module_overledger-dlt-ripple.Ripple"></a>

### *overledger-dlt-ripple*~Ripple

* [~Ripple](#module_overledger-dlt-ripple.Ripple)

    * [new Ripple(sdk, options)](#new_module_overledger-dlt-ripple.Ripple_new)

    * [.name](#module_overledger-dlt-ripple.Ripple+name)

    * [.symbol](#module_overledger-dlt-ripple.Ripple+symbol)

    * [.createAccount()](#module_overledger-dlt-ripple.Ripple+createAccount)

    * [.setAccount(privateKey)](#module_overledger-dlt-ripple.Ripple+setAccount)

    * [.buildTransaction(thisTransaction)](#module_overledger-dlt-ripple.Ripple+buildTransaction)

    * [._transactionValidation(thisTransaction)](#module_overledger-dlt-ripple.Ripple+_transactionValidation)

    * [._sign(thisTransaction)](#module_overledger-dlt-ripple.Ripple+_sign)

    * [._buildSmartContractQuery(dltAddress, contractQueryDetails)](#module_overledger-dlt-ripple.Ripple+_buildSmartContractQuery)

    * [._smartContractQueryValidation(contractQueryDetails)](#module_overledger-dlt-ripple.Ripple+_smartContractQueryValidation)


<a name="new_module_overledger-dlt-ripple.Ripple_new"></a>

#### new Ripple(sdk, options)

| Param | Type |
| --- | --- |
| sdk | <code>any</code> | 
| options | <code>Object</code> | 

<a name="module_overledger-dlt-ripple.Ripple+name"></a>

#### *ripple*.name
Name of the DLT

<a name="module_overledger-dlt-ripple.Ripple+symbol"></a>

#### *ripple*.symbol
Symbol of the DLT

<a name="module_overledger-dlt-ripple.Ripple+createAccount"></a>

#### *ripple*.createAccount()
Create an XRP account

**Returns**: <code>Account</code> - (privateKey, address)  
<a name="module_overledger-dlt-ripple.Ripple+setAccount"></a>

#### *ripple*.setAccount(privateKey)

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | The privateKey |

Set an account for signing for a specific DLT

<a name="module_overledger-dlt-ripple.Ripple+buildTransaction"></a>

#### *ripple*.buildTransaction(thisTransaction)

| Param | Type | Description |
| --- | --- | --- |
| thisTransaction | <code>TransactionXRPRequest</code> | details on the information to include in this transaction for the XRP distributed ledger |

Takes the Overledger definition of a transaction and converts it into a specific XRP transaction

**Returns**: <code>Transaction</code> - the XRP transaction  
<a name="module_overledger-dlt-ripple.Ripple+_transactionValidation"></a>

#### *ripple*._transactionValidation(thisTransaction)

| Param | Description |
| --- | --- |
| thisTransaction | The transaction request |

validates an OVL transactionRequest according to XRP specific rules

<a name="module_overledger-dlt-ripple.Ripple+_sign"></a>

#### *ripple*._sign(thisTransaction)

| Param | Type | Description |
| --- | --- | --- |
| thisTransaction | <code>TransactionRequest</code> | an instantiated overledger definition of an XRP transaction |

Takes in an overledger definition of a transaction for XRP, converts it into a form that the XRP distributed ledger will understand, and then signs the transaction

<a name="module_overledger-dlt-ripple.Ripple+_buildSmartContractQuery"></a>

#### *ripple*._buildSmartContractQuery(dltAddress, contractQueryDetails)

| Param | Type | Description |
| --- | --- | --- |
| dltAddress | <code>string</code> | the user's XRP address |
| contractQueryDetails | <code>Object</code> | the definition of the smart contract function the user wants to interact with, including information on what parameters to use in the function call. |

Allows a user to build a smart contract query for the XRP distributed ledger (currently not supported for XRP)

**Returns**: <code>Object</code> - success indicates if this query building was correct, if yes then it will be in the response field of the object  
<a name="module_overledger-dlt-ripple.Ripple+_smartContractQueryValidation"></a>

#### *ripple*._smartContractQueryValidation(contractQueryDetails)

| Param | Description |
| --- | --- |
| contractQueryDetails | the query details |

validates an OVL smart contract query according to XRP specific rules

**Returns**: <code>Object</code> - success indicates if this query building was correct, if yes then it will be in the response field of the object  
