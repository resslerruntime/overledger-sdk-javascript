//NOTE: replace @quantnetwork/ with ../../packages/ for all require statements below if you have not built the SDK yourself
const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '...';
const bpiKey = '...';

const ethereumAddress = '0x650A87cfB9165C9F4Ccc7B971D971f50f753e761';
const xrpAddress = 'rhTa8RGotyJQAW8sS2tFVVfvcHYXaps9hC';

// Note: Bitcoin addresses do not have a sequence number as Bitcoin is a UTXO-based distributed ledger

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: DltNameOptions.ETHEREUM }, { dlt: DltNameOptions.XRP }],
            provider: { network: 'testnet' },
        });

        const ethereumAddressSequence = await overledger.dlts.ethereum.getSequence(ethereumAddress);
        console.log('Ethereum address sequence:\n', ethereumAddressSequence.data);
        console.log("");

        const xrpAddressSequence = await overledger.dlts.ripple.getSequence(xrpAddress);
        console.log('XRP Ledger address sequence:\n', xrpAddressSequence.data);
        console.log("");

    } catch (e) {
        console.error('error', e);
    }
})();