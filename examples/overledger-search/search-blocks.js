const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '...';
const bpiKey = '...';

// includes what block number to search
const ethereumBlockNumber = '1000000';
const rippleBlockNumber = '4531496';
const bitcoinBlockNumber = '1000002';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
                //connect to overledger and choose which distributed ledgers to use:
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: DltNameOptions.bitcoin }, { dlt: DltNameOptions.ethereum }, { dlt: DltNameOptions.xrp }],
            provider: { network: 'testnet' },

        });

        const bitcoinBlock = await overledger.search.getBlockByDltAndNumber('bitcoin', bitcoinBlockNumber);
        console.log('Bitcoin block: ', bitcoinBlock.data);
        console.log("");
        
        const ethereumBlock = await overledger.search.getBlockByDltAndNumber('ethereum', ethereumBlockNumber);
        console.log('Ethereum block: ', ethereumBlock.data);
        console.log("");

        const rippleBlock = await overledger.search.getBlockByDltAndNumber('ripple', rippleBlockNumber);
        console.log('Ripple block: ', rippleBlock.data);
        console.log("");

    } catch (e) {
        console.error('error', e.response.data);
    }
})();