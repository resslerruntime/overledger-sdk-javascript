const OverledgerSDK = require('@quantnetwork/overledger-bundle/dist').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = 'network.quant.software';
const bpiKey = 'bpikeytest';

// After creating a transaction from a file in the a-to-b-transaction, you can put the transaction hash here to query its details
const ethereumTransactionHash = '0x1f8b49b579ec3803cf2b9e27673ab78d619d18f3ae296567145d616e2af3f2ca';
const rippleTransactionHash = '67D7AA9D1A0273E3FDB8264D78476571C3D3CDD5C9E5FA12DD0E7C990EC88620';
const bitcoinTransactionHash = 'cea5a345dcb7cb891f79c9f64ded895d47b66976b13a3c239deeaa7851164979';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        //connect to overledger and choose the XRP distributed ledger:
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: DltNameOptions.bitcoin }, { dlt: DltNameOptions.ethereum }, { dlt: DltNameOptions.xrp }],
            provider: { network: 'testnet' },
        });

        const bitcoinTransaction = await overledger.search.getTransaction(bitcoinTransactionHash);
        const ethereumTransaction = await overledger.search.getTransaction(ethereumTransactionHash);
        const rippleTransaction = await overledger.search.getTransaction(rippleTransactionHash);

        console.log('Bitcoin transaction: ', bitcoinTransaction.data);
        console.log('\n');
        console.log('Ethereum transaction: ', ethereumTransaction.data);
        console.log('\n');
        console.log('Ripple transaction: ', rippleTransaction.data);
        console.log('\n');
    } catch (e) {
        console.error('error', e);
    }
})();