const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '...';
const bpiKey = '...';

const ethereumAddress = '0x635B4764D1939DfAcD3a8014726159abC277BecC';
const rippleAddress = 'rHH8zWrNGYBj5uQQ9MC2XaTjeA1339j7Km';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
          dlts: [{ dlt: 'ethereum' }, { dlt: 'ripple' }],
            provider: { network: 'testnet' },
        });

        const array = [
          {
            dlt: DltNameOptions.ethereum,
            address: ethereumAddress,
          },
          {
            dlt: DltNameOptions.xrp,
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