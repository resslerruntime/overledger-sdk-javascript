//NOTE: replace @quantnetwork/ with ../../packages/ for all require statements below if you have not built the SDK yourself
const OverledgerSDK = require('@quantnetwork/overledger-bundle/dist').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '...';
const bpiKey = '...';

// After creating a transaction from a file in the a-to-b-transaction, you can put the transaction hash here to query its details
const bitcoinTransactionHash = 'cea5a345dcb7cb891f79c9f64ded895d47b66976b13a3c239deeaa7851164979';
const ethereumTransactionHash = '0x1f8b49b579ec3803cf2b9e27673ab78d619d18f3ae296567145d616e2af3f2ca';
const xrpTransactionHash = 'AF8EF2CA324D12D937679D2E277EED5820C3047B690D3B917CF6F7C58EE3D9A6';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        // Connect to overledger and choose which distributed ledgers to use:
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: DltNameOptions.BITCOIN }, { dlt: DltNameOptions.ETHEREUM }, { dlt: DltNameOptions.XRP }],
            provider: { network: 'testnet' },
        });

        // Search for the details of the transaction
        const bitcoinTransaction = await overledger.search.getTransaction(bitcoinTransactionHash);
        const ethereumTransaction = await overledger.search.getTransaction(ethereumTransactionHash);
        const xrpTransaction = await overledger.search.getTransaction(xrpTransactionHash);

        console.log('Bitcoin transaction: ', bitcoinTransaction.data);
        console.log("");
        console.log('Ethereum transaction: ', ethereumTransaction.data);
        console.log("");
        console.log('XRP transaction: ', xrpTransaction.data);
        console.log("");
    } catch (e) {
        console.error('error', e);
    }
})();