const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '...';
const bpiKey = '...';

// add which block to search
const ethereumBlockNumber = '1000000';
const rippleBlockNumber = '4531496';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: 'ethereum' }, { dlt: 'ripple' }],
            provider: { network: 'testnet' },

        });
        
        const ethereumBlock = await overledger.search.getBlockByDltAndNumber('ethereum', ethereumBlockNumber);
        console.log('Ethereum block: ', ethereumBlock.data);
        console.log('\n');

        const rippleBlock = await overledger.search.getBlockByDltAndNumber('ripple', rippleBlockNumber);
        console.log('Ripple block: ', rippleBlock.data);
        console.log('\n');

    } catch (e) {
        console.error('error', e.response.data);
    }
})();