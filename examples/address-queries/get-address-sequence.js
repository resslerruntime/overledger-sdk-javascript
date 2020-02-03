// Replace the dependency by @quantnetwork/overledger-bundle if you're in your own project
const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = 'network.quant.software';
const bpiKey = 'bpikeytest';

const ethereumAddress = '0xb5edb7f5F4e8133E90c2DEcF16cbeCD72C39621F';
const rippleAddress = 'rMQbAYHCjRsb6TT58ujn4o2jTfXdF2fQdx';

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
        console.log('\n');

        const rippleAddressSequence = await overledger.dlts.ripple.getSequence(rippleAddress);
        console.log('Ripple address sequence:\n', rippleAddressSequence.data);
        console.log('\n');

    } catch (e) {
        console.error('error', e);
    }
})();