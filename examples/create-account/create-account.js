// Replace the dependency by @quantnetwork/overledger-bundle if you're in your own project
const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = 'network.quant.software';
const bpiKey = 'bpikeytest';
const partyAEthereumAddress = '0x650A87cfB9165C9F4Ccc7B971D971f50f753e761';
const partyARippleAddress = 'rhTa8RGotyJQAW8sS2tFVVfvcHYXaps9hC';
//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: 'ethereum' }, { dlt: 'ripple' }],
            provider: { network: 'testnet' },
        });

        const array = [
          {
            dlt: 'ethereum',
            address: partyAEthereumAddress,
          },
          {
            dlt: 'ripple',
            address: partyARippleAddress,
          },
        ];

        const account = await overledger.dlts.ethereum.createAccount();
        console.log('Account:\n', account);
        console.log('\n');

    } catch (e) {
        console.error('error', e);
    }
})();