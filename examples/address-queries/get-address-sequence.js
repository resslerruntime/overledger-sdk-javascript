const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '...';
const bpiKey = '...';

const ethereumAddress = '...';
const rippleAddress = '...';
//note: Bitcoin addresses do not have a sequence number as Bitcoin is a UTXO-based distributed ledger

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: DltNameOptions.ethereum }, { dlt: DltNameOptions.xrp }],
            provider: { network: 'testnet' },
        });

        const ethereumAddressSequence = await overledger.dlts.ethereum.getSequence(ethereumAddress);
        console.log('Ethereum address sequence:\n', ethereumAddressSequence.data);
        console.log("");

        const rippleAddressSequence = await overledger.dlts.ripple.getSequence(rippleAddress);
        console.log('Ripple address sequence:\n', rippleAddressSequence.data);
        console.log("");

    } catch (e) {
        console.error('error', e);
    }
})();