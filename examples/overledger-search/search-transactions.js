const OverledgerSDK = require('@quantnetwork/overledger-bundle/dist').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
//The following are found from your Overledger Account:
const mappId = '...';
const bpiKey = '...';

// After creating a transaction from a file in the a-to-b-transaction, you can put the transaction hash here to query its details
const ethereumTransactionHash = '0xf18c2f363994591c8ca21bdd4cecb58d335736b009e8f36d74bb24527bd2a959';
const rippleTransactionHash = '67D7AA9D1A0273E3FDB8264D78476571C3D3CDD5C9E5FA12DD0E7C990EC88620';
//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        //connect to overledger and choose the XRP distributed ledger:
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: DltNameOptions.ethereum }, { dlt: DltNameOptions.xrp }],
            provider: { network: 'testnet' },
        });

        //get details on the transaction
        const ethereumTransaction = await overledger.search.getTransaction(ethereumTransactionHash);
        const rippleTransaction = await overledger.search.getTransaction(rippleTransactionHash);

        console.log('Ethereum transaction: ', ethereumTransaction.data);
        console.log('\n');
        console.log('Ripple transaction: ', rippleTransaction.data);
        console.log('\n');
    } catch (e) {
        console.error('error', e);
    }
})();