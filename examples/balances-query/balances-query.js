//NOTE: replace @quantnetwork/ with ../../packages/ for all require statements below if you have not built the SDK yourself
const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '...';
const bpiKey = '...';

const ethereumAddress = '...';
const rippleAddress = '...';

// Note: You cannot retrieve a Bitcoin address balance unless a wallet is integrated. This is due to Bitcoin being a UTXO-based distributed ledger

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
          dlts: [{ dlt: DltNameOptions.ethereum }, { dlt: DltNameOptions.xrp }],
            provider: { network: 'testnet' },
        });

        const array = [
          {
            dlt: DltNameOptions.ethereum,
            address: ethereumAddress,
          },
          {
            dlt: DltNameOptions.xrp,
            address: rippleAddress,
          },
        ];

        const balances = await overledger.getBalances(array);
        console.log('Balances:\n', balances.data);
        console.log("");

    } catch (e) {
        console.error('error', e.response.data);
    }
})();