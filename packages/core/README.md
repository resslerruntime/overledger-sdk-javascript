# core

This is the main package of [overledger-sdk][repo]

Please read the [readme][repo] and [documentation][doc] for more.

This is the lightweight package, you will have to manually include all the DLTs you want to use with overledger.

## Installation

```bash
npm install @overledger/core
npm install @overledger/dlt-bitcoin
```

### Usage

```js 
import OverledgerSDK from '@overledger/bundle';

new OverledgerSDK(mappId, bpiKey, {
  dlts: [{ dlt: 'bitcoin' }],
});
```

## Types 

All the typescript typings are placed in the types folder. 
#TODO: Add the typings

[docs]: https://github.com/quantnetwork/overledger-sdk-javascript/blob/master/README.md
[repo]: https://github.com/quantnetwork/overledger-sdk-javascript
