[docs]: https://github.com/quantnetwork/overledger-sdk-javascript/blob/master/README.md
[repo]: https://github.com/quantnetwork/overledger-sdk-javascript

# @quantnetwork/overledger-dlt-corda

[Overledger SDK][repo] module for interaction with the corda distributed ledger technology.

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @quantnetwork/overledger-dlt-corda
```

Or, if you prefer using [yarn](https://yarnpkg.com/):

```
yarn add @quantnetwork/overledger-dlt-corda
```

## API Reference

## Modules

<dl>
<dt><a href="#module_overledger-dlt-corda">overledger-dlt-corda</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#CordaParam">CordaParam</a> : <code>Object</code></dt>
<dd><p>A description of an Corda smart contract function parameter.</p>
</dd>
</dl>

<a name="module_overledger-dlt-corda"></a>

## overledger-dlt-corda

* [overledger-dlt-corda](#module_overledger-dlt-corda)

    * _static_
        * [.CordaTypeOptions](#module_overledger-dlt-corda.CordaTypeOptions)

        * [.default](#module_overledger-dlt-corda.default)

    * _inner_
        * [~Corda](#module_overledger-dlt-corda.Corda)

            * [new Corda(sdk)](#new_module_overledger-dlt-corda.Corda_new)

            * [.name](#module_overledger-dlt-corda.Corda+name)

            * [.symbol](#module_overledger-dlt-corda.Corda+symbol)

            * [.createAccount()](#module_overledger-dlt-corda.Corda+createAccount)

            * [.setAccount(accountInfo)](#module_overledger-dlt-corda.Corda+setAccount)

            * [.buildTransaction()](#module_overledger-dlt-corda.Corda+buildTransaction)

            * [.buildWorkflow(thisTransaction)](#module_overledger-dlt-corda.Corda+buildWorkflow)

            * [.create_UUID()](#module_overledger-dlt-corda.Corda+create_UUID)

            * [._transactionValidation()](#module_overledger-dlt-corda.Corda+_transactionValidation)

            * [.getTransactionQueryInfo()](#module_overledger-dlt-corda.Corda+getTransactionQueryInfo)

            * [.workflowValidation(thisWorkflow)](#module_overledger-dlt-corda.Corda+workflowValidation)

            * [._sign(thisTransaction)](#module_overledger-dlt-corda.Corda+_sign)

            * [._smartContractQueryValidation()](#module_overledger-dlt-corda.Corda+_smartContractQueryValidation)

            * [._buildSmartContractQuery()](#module_overledger-dlt-corda.Corda+_buildSmartContractQuery)


<a name="module_overledger-dlt-corda.CordaTypeOptions"></a>

### *overledger-dlt-corda*.CordaTypeOptions
<a name="module_overledger-dlt-corda.default"></a>

### *overledger-dlt-corda*.default
Development package for Corda.

<a name="module_overledger-dlt-corda.Corda"></a>

### *overledger-dlt-corda*~Corda

* [~Corda](#module_overledger-dlt-corda.Corda)

    * [new Corda(sdk)](#new_module_overledger-dlt-corda.Corda_new)

    * [.name](#module_overledger-dlt-corda.Corda+name)

    * [.symbol](#module_overledger-dlt-corda.Corda+symbol)

    * [.createAccount()](#module_overledger-dlt-corda.Corda+createAccount)

    * [.setAccount(accountInfo)](#module_overledger-dlt-corda.Corda+setAccount)

    * [.buildTransaction()](#module_overledger-dlt-corda.Corda+buildTransaction)

    * [.buildWorkflow(thisTransaction)](#module_overledger-dlt-corda.Corda+buildWorkflow)

    * [.create_UUID()](#module_overledger-dlt-corda.Corda+create_UUID)

    * [._transactionValidation()](#module_overledger-dlt-corda.Corda+_transactionValidation)

    * [.getTransactionQueryInfo()](#module_overledger-dlt-corda.Corda+getTransactionQueryInfo)

    * [.workflowValidation(thisWorkflow)](#module_overledger-dlt-corda.Corda+workflowValidation)

    * [._sign(thisTransaction)](#module_overledger-dlt-corda.Corda+_sign)

    * [._smartContractQueryValidation()](#module_overledger-dlt-corda.Corda+_smartContractQueryValidation)

    * [._buildSmartContractQuery()](#module_overledger-dlt-corda.Corda+_buildSmartContractQuery)


<a name="new_module_overledger-dlt-corda.Corda_new"></a>

#### new Corda(sdk)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>any</code> | the sdk instance |

<a name="module_overledger-dlt-corda.Corda+name"></a>

#### *corda*.name
Name of the DLT

<a name="module_overledger-dlt-corda.Corda+symbol"></a>

#### *corda*.symbol
Symbol of the DLT

<a name="module_overledger-dlt-corda.Corda+createAccount"></a>

#### *corda*.createAccount()
Create an Corda account

**Returns**: <code>Account</code> - the new Corda account  
<a name="module_overledger-dlt-corda.Corda+setAccount"></a>

#### *corda*.setAccount(accountInfo)

| Param | Type | Description |
| --- | --- | --- |
| accountInfo | <code>Account</code> | The standardised account information |

Set an account for this specific DLT

<a name="module_overledger-dlt-corda.Corda+buildTransaction"></a>

#### *corda*.buildTransaction()
Takes the Overledger definition of a transaction and converts it into a specific Corda transaction

<a name="module_overledger-dlt-corda.Corda+buildWorkflow"></a>

#### *corda*.buildWorkflow(thisTransaction)

| Param | Type | Description |
| --- | --- | --- |
| thisTransaction | <code>WorkflowCorda</code> | details on the information to include in this workflow for the Corda distributed ledger node |

Takes the Overledger definition of a Corda workflow and converts it into a specific Corda Workflow

**Returns**: <code>Workflow</code> - the Corda transaction  
<a name="module_overledger-dlt-corda.Corda+create_UUID"></a>

#### *corda*.create_UUID()
Creates a new UUID

<a name="module_overledger-dlt-corda.Corda+_transactionValidation"></a>

#### *corda*._transactionValidation()
validates an OVL transactionRequest according to Corda specific rules

<a name="module_overledger-dlt-corda.Corda+getTransactionQueryInfo"></a>

#### *corda*.getTransactionQueryInfo()
Get the information required to query for a particular transaction hash

<a name="module_overledger-dlt-corda.Corda+workflowValidation"></a>

#### *corda*.workflowValidation(thisWorkflow)

| Param | Type | Description |
| --- | --- | --- |
| thisWorkflow | <code>WorkflowCorda</code> | The workflow details |

validates an OVL Corda workflow according to Corda specific rules

<a name="module_overledger-dlt-corda.Corda+_sign"></a>

#### *corda*._sign(thisTransaction)

| Param | Type | Description |
| --- | --- | --- |
| thisTransaction | <code>TransactionRequest</code> | an instantiated overledger definition of an Corda transaction |

Takes in an overledger definition of a transaction for Corda, converts it into a form that the Corda distributed ledger will understand, and then signs the transaction

<a name="module_overledger-dlt-corda.Corda+_smartContractQueryValidation"></a>

#### *corda*._smartContractQueryValidation()
validates an OVL smart contract query according to Corda specific rules

<a name="module_overledger-dlt-corda.Corda+_buildSmartContractQuery"></a>

#### *corda*._buildSmartContractQuery()
Allows a user to build a smart contract query for the Corda distributed ledger

<a name="CordaParam"></a>

## CordaParam
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>object</code> | information on the selectedType from the valid options. If an integer or byte type was chosen then further information is required on the exact number of bytes being used. If an integer is used, then selectedIntegerLength is required. If a byte is used then selectedBytesLength is required |
| value | <code>object</code> | information on the parameter's value |
| name | <code>string</code> | the parameter's name |

A description of an Corda smart contract function parameter.

