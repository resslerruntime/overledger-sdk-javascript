const OverledgerSDK = require("../../packages/bundle").default;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = 'network.quant.examples.search';
const bpiKey = 'DkucSXHTIKsNoT7EX9kfpvkVyorhSoa4odHLnYS-3f0';

// If looking for transaction hashes, they can be returned by running the 'a-to-b-transaction' example
const bitcoinTransactionHash = 'cba56fa5543cab114ff54b315a453a89912ce34737e7d1a799e22f9f00b501d9';
const ethereumTransactionHash = '0x4016406d985f0273d841353c95e88906fc805c700b7a5bf4c79124df1dd53985';
const rippleTransactionHash = 'A7606719C83BCE64A43D102FB7D6DDF0B1A8E7014512D395E0756D1D7EBA287F';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: "bitcoin" }, { dlt: 'ethereum' }, { dlt: 'ripple' }],
            // TODO: Set this to 'testnet' once the release is live
            provider: { network: 'http://10.7.4.236:30020/v1' },

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
        console.error('error', e.response.data);
    }
})();