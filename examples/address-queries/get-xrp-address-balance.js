// Replace the dependency by @quantnetwork/overledger-bundle if you're in your own project
const OverledgerSDK = require('../../packages/overledger-bundle/dist').default;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
//The following are found from your Overledger Account:
const mappId = 'network.quant.software';
const bpiKey = 'bpikeytest';

//enter here the ripple address to query:
const rippleAddress = '<ENTER YOUR XRP ADDRESS>';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: DltNames.xrp }],
            provider: { network: 'testnet' },
        });


        const rippleAddressBalance = await overledger.dlts.ripple.getBalance(rippleAddress);
        console.log('XRP address balance:\n', rippleAddressBalance.data);
        console.log('\n');
    } catch (e) {
        console.error('error', e.response.data);
    }
})();
