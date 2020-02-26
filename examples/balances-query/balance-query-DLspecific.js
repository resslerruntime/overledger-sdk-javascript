//NOTE: replace @quantnetwork/ with ../../packages/ for all require statements below if you have not built the SDK yourself
const OverledgerSDK = require('@quantnetwork/overledger-bundle/dist').default;
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
; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: DltNameOptions.ethereum }, { dlt: DltNameOptions.xrp }],
            provider: { network: 'testnet' },
        });

        const rippleAddressBalance = await overledger.dlts.ripple.getBalance(rippleAddress);
        console.log('XRP address balance:\n', rippleAddressBalance.data);
        console.log("");

        const ethereumAddressBalance = await overledger.dlts.ethereum.getBalance(ethereumAddress);
        console.log('Ethereum address balance:\n', ethereumAddressBalance.data);
        console.log("");
    } catch (e) {
        console.error('error', e);
    }
})();
