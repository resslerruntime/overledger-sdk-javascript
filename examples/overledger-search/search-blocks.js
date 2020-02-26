//NOTE: replace @quantnetwork/ with ../../packages/ for all require statements below if you have not built the SDK yourself
const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '...';
const bpiKey = '...';

// Includes what block number to search
const ethereumBlockNumber = '1000000';
const xrpBlockNumber = '4923953';
const bitcoinBlockNumber = '1000002';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
                // connect to overledger and choose which distributed ledgers to use:
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: DltNameOptions.BITCOIN }, { dlt: DltNameOptions.ETHEREUM }, { dlt: DltNameOptions.XRP }],
            provider: { network: 'testnet' },

        });

        const bitcoinBlock = await overledger.search.getBlockByDltAndNumber(DltNameOptions.BITCOIN, bitcoinBlockNumber);
        console.log('Bitcoin block: ', bitcoinBlock.data);
        console.log("");
        
        const ethereumBlock = await overledger.search.getBlockByDltAndNumber(DltNameOptions.ETHEREUM, ethereumBlockNumber);
        console.log('Ethereum block: ', ethereumBlock.data);
        console.log("");

        const xrpBlock = await overledger.search.getBlockByDltAndNumber(DltNameOptions.XRP, xrpBlockNumber);
        console.log('XRP ledger block: ', xrpBlock.data);
        console.log("");

    } catch (e) {
        console.error('error', e.response.data);
    }
})();