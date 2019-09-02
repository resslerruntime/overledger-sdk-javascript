const OverledgerSDK = require('../../packages/bundle').default;

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
            dlts: [{ dlt: 'bitcoin' }, { dlt: 'ethereum' }, { dlt: 'ripple' }],
            provider: { network: 'testnet' },
        });

        const array = [
          {
            dlt: 'ethereum',
            address: ethereumAddress,
          },
          {
            dlt: 'ripple',
            address: rippleAddress,
          },
        ];

        const balances = await overledger.getBalances(array);
        console.log('Balances:\n', balances.data);
        console.log('\n');

    } catch (e) {
        console.error('error', e.response.data);
    }
})();
