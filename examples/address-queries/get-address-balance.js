// Replace the dependency by @quantnetwork/overledger-bundle if you're in your own project
const OverledgerSDK = require('../../packages/overledger-bundle').default;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = 'network.quant.software';
const bpiKey = 'bpikeytest';

const ethereumAddress = '0x635B4764D1939DfAcD3a8014726159abC277BecC';
const rippleAddress = 'rHH8zWrNGYBj5uQQ9MC2XaTjeA1339j7Km';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: "bitcoin" }, { dlt: 'ethereum' }, { dlt: 'ripple' }],
            provider: { network: 'testnet' },
        });

        const ethereumAddressBalance = await overledger.dlts.ethereum.getBalance(ethereumAddress);
        console.log('Ethereum address balance:\n', ethereumAddressBalance.data);
        console.log('\n');

        const rippleAddressBalance = await overledger.dlts.ripple.getBalance(rippleAddress);
        console.log('Ripple address balance:\n', rippleAddressBalance.data);
        console.log('\n');
    } catch (e) {
        console.error('error', e.response.data);
    }
})();
