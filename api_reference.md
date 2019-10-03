## Modules

<dl>
<dt><a href="#module_bundle">bundle</a></dt>
<dd></dd>
<dt><a href="#module_core">core</a></dt>
<dd></dd>
<dt><a href="#module_dlt-abstract">dlt-abstract</a></dt>
<dd></dd>
<dt><a href="#module_dlt-ethereum">dlt-ethereum</a></dt>
<dd></dd>
<dt><a href="#module_dlt-ripple">dlt-ripple</a></dt>
<dd></dd>
<dt><a href="#module_provider">provider</a></dt>
<dd></dd>
<dt><a href="#module_search">search</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#OverledgerSDK">OverledgerSDK</a></dt>
<dd></dd>
<dt><a href="#AbstractDLT">AbstractDLT</a></dt>
<dd></dd>
<dt><a href="#Ethereum">Ethereum</a></dt>
<dd></dd>
<dt><a href="#Ripple">Ripple</a></dt>
<dd></dd>
<dt><a href="#OverledgerSearch">OverledgerSearch</a></dt>
<dd></dd>
</dl>

<a name="module_bundle"></a>

## bundle
<a name="module_bundle.default"></a>

### *bundle*.default
Main Overledger SDK class

<a name="module_core"></a>

## core
<a name="module_dlt-abstract"></a>

## dlt-abstract
<a name="module_dlt-ethereum"></a>

## dlt-ethereum
<a name="module_dlt-ripple"></a>

## dlt-ripple
<a name="module_provider"></a>

## provider
<a name="module_search"></a>

## search
<a name="OverledgerSDK"></a>

## OverledgerSDK

* [OverledgerSDK](#OverledgerSDK)

    * [new OverledgerSDK(mappId, bpiKey, options)](#new_OverledgerSDK_new)

    * [.dlts](#OverledgerSDK+dlts)

    * [.loadDlt(config)](#OverledgerSDK+loadDlt)

    * [.validateOptions(options)](#OverledgerSDK+validateOptions)

    * [.buildWrapperApiCall(signedTransactionRequest)](#OverledgerSDK+buildWrapperApiCall)

    * [.sign(unsignedData)](#OverledgerSDK+sign)

    * [.send(signedTransactions)](#OverledgerSDK+send)

    * [.getBalances(balancesRequest)](#OverledgerSDK+getBalances)

    * [.getSequences(sequenceRequest)](#OverledgerSDK+getSequences)

    * [.readTransactionsByMappId()](#OverledgerSDK+readTransactionsByMappId)

    * [.readOverledgerTransaction(overledgerTransactionId)](#OverledgerSDK+readOverledgerTransaction)

    * [.setMappId(mappId)](#OverledgerSDK+setMappId)

    * [.getMappId()](#OverledgerSDK+getMappId)

    * [.setBpiKey(bpiKey)](#OverledgerSDK+setBpiKey)

    * [.getBpiKey()](#OverledgerSDK+getBpiKey)


<a name="new_OverledgerSDK_new"></a>

### new OverledgerSDK(mappId, bpiKey, options)

| Param | Type | Description |
| --- | --- | --- |
| mappId | <code>string</code> | The Multi-chain Application ID |
| bpiKey | <code>string</code> | The Overledger Blockchain Programming Interface license key |
| options | <code>SDKOptions</code> | The DLT Options and Provider Options |

Create the Overledger SDK

<a name="OverledgerSDK+dlts"></a>

### *overledgerSDK*.dlts
The object storing the DLTs loaded by the Overledger SDK

<a name="OverledgerSDK+loadDlt"></a>

### *overledgerSDK*.loadDlt(config)

| Param | Type | Description |
| --- | --- | --- |
| config | <code>DLTOptions</code> | DLT name and an optional Private Key to use as the main account |

Load the DLT in the Overledger SDK

**Returns**: [<code>AbstractDLT</code>](#AbstractDLT) - The loaded DLT class  
<a name="OverledgerSDK+validateOptions"></a>

### *overledgerSDK*.validateOptions(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>SDKOptions</code> | The DLT Options and Provider Options |

Validate the provided Overledger SDK Options

<a name="OverledgerSDK+buildWrapperApiCall"></a>

### *overledgerSDK*.buildWrapperApiCall(signedTransactionRequest)

| Param | Type | Description |
| --- | --- | --- |
| signedTransactionRequest | <code>Array.&lt;SignedTransactionRequest&gt;</code> | Array of signed transactions |

Wrap the DLT Data with the API schema

**Returns**: <code>APICallWrapper</code> - Object conforming to the API schema  
<a name="OverledgerSDK+sign"></a>

### *overledgerSDK*.sign(unsignedData)

| Param | Type | Description |
| --- | --- | --- |
| unsignedData | <code>Array.&lt;UnsignedData&gt;</code> | Array of unsigned data |

Sign the provided transactions

**Returns**: <code>Array.&lt;SignedTransactionRequest&gt;</code> - Array of signed transaction requests wrapped by Overledger metadata  
<a name="OverledgerSDK+send"></a>

### *overledgerSDK*.send(signedTransactions)

| Param | Type | Description |
| --- | --- | --- |
| signedTransactions | <code>Array.&lt;SignedTransactionRequest&gt;</code> | Array of Overledger signed transaction data |

Send signed transactions to Overledger

<a name="OverledgerSDK+getBalances"></a>

### *overledgerSDK*.getBalances(balancesRequest)

| Param | Type | Description |
| --- | --- | --- |
| balancesRequest | <code>Array.&lt;DLTAndAddress&gt;</code> | Array of objects specifing the address and corresponding DLT |

Get the balances of the specified addresses

<a name="OverledgerSDK+getSequences"></a>

### *overledgerSDK*.getSequences(sequenceRequest)

| Param | Type | Description |
| --- | --- | --- |
| sequenceRequest | <code>Array.&lt;SequenceDataRequest&gt;</code> | Request for sequence numbers of the provided addresses |

Get the sequence numbers for the provided addresses

**Returns**: <code>SequenceDataResponse</code> - Sequence response  
<a name="OverledgerSDK+readTransactionsByMappId"></a>

### *overledgerSDK*.readTransactionsByMappId()
Get transactions submitted through Oberledger by the Multi-Chain Application ID used to create the SDK

<a name="OverledgerSDK+readOverledgerTransaction"></a>

### *overledgerSDK*.readOverledgerTransaction(overledgerTransactionId)

| Param | Type | Description |
| --- | --- | --- |
| overledgerTransactionId | <code>string</code> | Overledger Transaction ID |

Get the transaction specified by the Overledger Transaction ID

<a name="OverledgerSDK+setMappId"></a>

### *overledgerSDK*.setMappId(mappId)

| Param | Type | Description |
| --- | --- | --- |
| mappId | <code>string</code> | Multi-Chain Application ID |

Set the Multi-Chain Application ID

<a name="OverledgerSDK+getMappId"></a>

### *overledgerSDK*.getMappId()
Get the Multi-Chain Application ID

<a name="OverledgerSDK+setBpiKey"></a>

### *overledgerSDK*.setBpiKey(bpiKey)

| Param | Type |
| --- | --- |
| bpiKey | <code>string</code> | 

Set the Overledger Blockchain Programming Interface license key

<a name="OverledgerSDK+getBpiKey"></a>

### *overledgerSDK*.getBpiKey()
Get the Overledger Blockchain Programming Interface license key

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

