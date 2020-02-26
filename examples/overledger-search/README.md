# Overledger Search

This example contains two scripts:
1. Searching for transactions
2. Searching for blocks

## Building

In order to run the examples, first, make sure you have built the sdk by running the following command in the root folder of the project:

```
npm run build
```

## Running the scripts

Each script has a section at the beginning where a couple of variables need to be initialised. First, set a mappId and BPI key. Then you can just run:

```
node search-transactions.js
```

and

```
node search-blocks.js
```

The first one will return transaction information, while the second one will return block information. Feel free to change the initial variables to check info about different transactions/blocks.