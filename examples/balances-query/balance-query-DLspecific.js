const OverledgerSDK = require('@quantnetwork/overledger-bundle/dist').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
//The following are found from your Overledger Account:
const mappId = '...';
const bpiKey = '...';

//enter here the ripple address to query:
const ethereumAddress = '...';
const rippleAddress = '...';

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
