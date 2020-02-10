const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '...';
const bpiKey = '...';
//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
          dlts: [{ dlt: DltNameOptions.ethereum }, { dlt: DltNameOptions.xrp }],
            provider: { network: 'testnet' },
        });

        const ethAccount = await overledger.dlts.ethereum.createAccount();
        console.log('Account:\n', ethAccount);
        console.log('\n');

        const xrpAccount = await overledger.dlts.ripple.createAccount();
        console.log('Account:\n', xrpAccount);
        console.log('\n');

    } catch (e) {
        console.error('error', e);
    }
})();