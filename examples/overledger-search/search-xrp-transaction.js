// Replace the dependency by @quantnetwork/overledger-bundle if you're in your own project
const OverledgerSDK = require('@quantnetwork/overledger-bundle/dist').default;
const DltNames = require('@quantnetwork/overledger-dlt-abstract/dist/AbstractDLT').DltNames;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
//The following are found from your Overledger Account:
const mappId = 'network.quant.software';
const bpiKey = 'bpikeytest';

// After creating a transaction from a file in the a-to-b-transaction, you can put the transaction hash here to query its details
const rippleTransactionHash = '170D6BC2A823B1B8042CD9A613E94F6D9F408B88E01C8BAE8ABA21011C7DCC8F';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        //connect to overledger and choose the XRP distributed ledger:
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: DltNames.xrp }],
            provider: { network: 'testnet' },
        });

        //get details on the transaction
        const rippleTransaction = await overledger.search.getTransaction(rippleTransactionHash);

        console.log('XRP transaction: ', rippleTransaction.data);
        console.log('\n');
    } catch (e) {
        console.error('error', e.response.data);
    }
})();