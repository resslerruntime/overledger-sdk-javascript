# Multichain Balances Request

This example contains one script to return the balances for mutliple addresses on multiple DLTs.

## Building

In order to run the example, first, make sure you have built the SDK by running the following command in the root folder of the project:

```
npm run build
```

## Running the example

The script has a section at the beginning where a couple of variables need to be initialised. First, set a mappId and BPI key. Then you can just run:

```
node get-balances.js
```

This will return the balances for the addresses declared. At the moment, getting the balance on Bitcoin is not supported.
