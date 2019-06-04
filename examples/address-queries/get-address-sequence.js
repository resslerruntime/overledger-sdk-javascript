const OverledgerSDK = require("../../packages/bundle").default;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '<ENTER YOUR MAPPID>';
const bpiKey = '<ENTER YOUR BPIKEY>';

const ethereumAddress = '0x8661C6a3A44862498aB944C921858A5faDa931A7';
const rippleAddress = 'rJR7t9RDQupG5BbHramSKVcQH6jfpNdrxK';

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

        const ethereumAddressSequence = await overledger.dlts.ethereum.getSequence(ethereumAddress);
        console.log('Ethereum address sequence:\n', ethereumAddressSequence.data);
        console.log('\n');

        const rippleAddressSequence = await overledger.dlts.ripple.getSequence(rippleAddress);
        console.log('Ripple address sequence:\n', rippleAddressSequence.data);
        console.log('\n');

    } catch (e) {
        console.error('error', e.response.data);
    }
})();
