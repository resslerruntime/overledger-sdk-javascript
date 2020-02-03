// Replace the dependency by @quantnetwork/overledger-bundle if you're in your own project
const OverledgerSDK = require('@quantnetwork/overledger-bundle/dist').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
//The following are found from your Overledger Account:
const mappId = 'network.quant.software';
const bpiKey = 'bpikeytest';

//enter here the ripple address to query:
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

        const rippleAddressBalance = await overledger.dlts.ripple.getBalance(rippleAddress);
        console.log('XRP address balance:\n', rippleAddressBalance.data);
        console.log('\n');

        const ethereumAddressBalance = await overledger.dlts.ethereum.getBalance(ethereumAddress);
        console.log('Ethereum address balance:\n', ethereumAddressBalance.data);
        console.log('\n');
    } catch (e) {
        console.error('error', e);
    }
})();
