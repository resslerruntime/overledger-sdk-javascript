[docs]: https://github.com/quantnetwork/overledger-sdk-javascript/blob/master/README.md
[repo]: https://github.com/quantnetwork/overledger-sdk-javascript

# @quantnetwork/overledger-dlt-ethereum

[Overledger SDK][repo] module for interaction with the Ethereum distributed ledger technology.

## Installation

Install using [npm](https://www.npmjs.org/):
```
npm install @quantnetwork/overledger-dlt-ethereum
```

Or, if you prefer using [yarn](https://yarnpkg.com/):

```
yarn add @quantnetwork/overledger-dlt-ethereum
```

## API Reference

## Modules

<dl>
<dt><a href="#module_overledger-dlt-hyperledger_fabric">overledger-dlt-hyperledger_fabric</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#computeParamType">computeParamType(param)</a></dt>
<dd><p>This function is used to prepare the parameter definition for the web3 package</p>
</dd>
</dl>

<a name="module_overledger-dlt-hyperledger_fabric"></a>

## overledger-dlt-hyperledger_fabric

* [overledger-dlt-hyperledger_fabric](#module_overledger-dlt-hyperledger_fabric)

    * _static_
        * [.HyperledgerFabricTypeOptions](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabricTypeOptions)

        * [.default](#module_overledger-dlt-hyperledger_fabric.default)

    * _inner_
        * [~HyperledgerFabric](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric)

            * [new HyperledgerFabric(sdk)](#new_module_overledger-dlt-hyperledger_fabric.HyperledgerFabric_new)

            * [.name](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+name)

            * [.symbol](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+symbol)

            * [.createAccount()](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+createAccount)

            * [.setAccount(accountInfo)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+setAccount)

            * [.buildTransaction(thisTransaction)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+buildTransaction)

            * [._transactionValidation(thisTransaction)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+_transactionValidation)

            * [._smartContractQueryValidation(contractQueryDetails)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+_smartContractQueryValidation)

            * [.computeTransactionDataForFunctionCall(invocationType, paramsList)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+computeTransactionDataForFunctionCall)

            * [._sign(thisTransaction)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+_sign)

            * [.getTransactionQueryInfo()](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+getTransactionQueryInfo)

            * [._buildSmartContractQuery(dltAddress, contractQueryDetails)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+_buildSmartContractQuery)

            * [.computeSCQueryInputValuesList(inputFunctionParams)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+computeSCQueryInputValuesList)

            * [.computeSCQueryOutputTypesList(outputFunctionTypes)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+computeSCQueryOutputTypesList)


<a name="module_overledger-dlt-hyperledger_fabric.HyperledgerFabricTypeOptions"></a>

### *overledger-dlt-hyperledger_fabric*.HyperledgerFabricTypeOptions
<a name="module_overledger-dlt-hyperledger_fabric.default"></a>

### *overledger-dlt-hyperledger_fabric*.default
Development package for HyperledgerFabric.

<a name="module_overledger-dlt-hyperledger_fabric.HyperledgerFabric"></a>

### *overledger-dlt-hyperledger_fabric*~HyperledgerFabric

* [~HyperledgerFabric](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric)

    * [new HyperledgerFabric(sdk)](#new_module_overledger-dlt-hyperledger_fabric.HyperledgerFabric_new)

    * [.name](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+name)

    * [.symbol](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+symbol)

    * [.createAccount()](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+createAccount)

    * [.setAccount(accountInfo)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+setAccount)

    * [.buildTransaction(thisTransaction)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+buildTransaction)

    * [._transactionValidation(thisTransaction)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+_transactionValidation)

    * [._smartContractQueryValidation(contractQueryDetails)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+_smartContractQueryValidation)

    * [.computeTransactionDataForFunctionCall(invocationType, paramsList)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+computeTransactionDataForFunctionCall)

    * [._sign(thisTransaction)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+_sign)

    * [.getTransactionQueryInfo()](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+getTransactionQueryInfo)

    * [._buildSmartContractQuery(dltAddress, contractQueryDetails)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+_buildSmartContractQuery)

    * [.computeSCQueryInputValuesList(inputFunctionParams)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+computeSCQueryInputValuesList)

    * [.computeSCQueryOutputTypesList(outputFunctionTypes)](#module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+computeSCQueryOutputTypesList)


<a name="new_module_overledger-dlt-hyperledger_fabric.HyperledgerFabric_new"></a>

#### new HyperledgerFabric(sdk)

| Param | Type | Description |
| --- | --- | --- |
| sdk | <code>any</code> | the sdk instance |

<a name="module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+name"></a>

#### *hyperledgerFabric*.name
Name of the DLT

<a name="module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+symbol"></a>

#### *hyperledgerFabric*.symbol
Symbol of the DLT

<a name="module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+createAccount"></a>

#### *hyperledgerFabric*.createAccount()
Create an Hyperledger Fabric account

**Returns**: <code>Account</code> - the new Hyperledger Fabric account  
<a name="module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+setAccount"></a>

#### *hyperledgerFabric*.setAccount(accountInfo)

| Param | Type | Description |
| --- | --- | --- |
| accountInfo | <code>Account</code> | The standardised account information |

Set an account for this specific DLT

<a name="module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+buildTransaction"></a>

#### *hyperledgerFabric*.buildTransaction(thisTransaction)

| Param | Type | Description |
| --- | --- | --- |
| thisTransaction | <code>TransactionHyperledgerFabricRequest</code> | details on the information to include in this transaction for the Hyperledger Fabric distributed ledger |

Takes the Overledger definition of a transaction and converts it into a specific Hyperledger Fabric transaction

**Returns**: <code>Transaction</code> - the Hyperledger Fabric transaction  
<a name="module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+_transactionValidation"></a>

#### *hyperledgerFabric*._transactionValidation(thisTransaction)

| Param | Description |
| --- | --- |
| thisTransaction | The transaction request |

validates an OVL transactionRequest according to Hyperledger Fabric specific rules

<a name="module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+_smartContractQueryValidation"></a>

#### *hyperledgerFabric*._smartContractQueryValidation(contractQueryDetails)

| Param | Type | Description |
| --- | --- | --- |
| contractQueryDetails | <code>SmartContract</code> | The transaction request |

validates an OVL smart contract query according to Hyperledger Fabric specific rules

<a name="module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+computeTransactionDataForFunctionCall"></a>

#### *hyperledgerFabric*.computeTransactionDataForFunctionCall(invocationType, paramsList)

| Param | Type | Description |
| --- | --- | --- |
| invocationType | <code>string</code> | the type of smart contract function call |
| paramsList | <code>Array.&lt;SCHyperledgerFabricParam&gt;</code> | the list of parameters that this function takes as input |

Convert Overledger object description of a smart contract function and parameters into Hyperledger Fabric versions

**Returns**: <code>string</code> - the bytecode of this function call  
<a name="module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+_sign"></a>

#### *hyperledgerFabric*._sign(thisTransaction)

| Param | Type | Description |
| --- | --- | --- |
| thisTransaction | <code>TransactionRequest</code> | an instantiated overledger definition of a Hyperledger Fabric transaction |

Takes in an overledger definition of a transaction for Hyperledger Fabric, converts it into a form that the Hyperledger Fabric distributed ledger will understand, and then signs the transaction

<a name="module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+getTransactionQueryInfo"></a>

#### *hyperledgerFabric*.getTransactionQueryInfo()
Get the information required to query for a particular transaction hash

<a name="module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+_buildSmartContractQuery"></a>

#### *hyperledgerFabric*._buildSmartContractQuery(dltAddress, contractQueryDetails)

| Param | Type | Description |
| --- | --- | --- |
| dltAddress | <code>string</code> | the user's Hyperledger Fabric address |
| contractQueryDetails | <code>SmartContractHyperledgerFabric</code> | the definition of the smart contract function the user wants to interact with, including information on what parameters to use in the function call. |

Allows a user to build a smart contract query for the Hyperledger Fabric distributed ledger

**Returns**: <code>Object</code> - success indicates if this query building was correct, if yes then it will be in the response field of the object  
<a name="module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+computeSCQueryInputValuesList"></a>

#### *hyperledgerFabric*.computeSCQueryInputValuesList(inputFunctionParams)

| Param | Type | Description |
| --- | --- | --- |
| inputFunctionParams | <code>Array.&lt;SCHyperledgerFabricParam&gt;</code> | the list of input parameters |

computes the input parameters into the smart contract function query

<a name="module_overledger-dlt-hyperledger_fabric.HyperledgerFabric+computeSCQueryOutputTypesList"></a>

#### *hyperledgerFabric*.computeSCQueryOutputTypesList(outputFunctionTypes)

| Param | Type |
| --- | --- |
| outputFunctionTypes | <code>Array.&lt;SCHyperledgerFabricParam&gt;</code> | 

computes the output parameters into the smart contract function query

<a name="computeParamType"></a>

## computeParamType(param)

| Param | Description |
| --- | --- |
| param | the parameter definition |

This function is used to prepare the parameter definition for the web3 package

