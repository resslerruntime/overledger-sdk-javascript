//NOTE: replace @quantnetwork/ with ../../packages/ for all require statements below if you have not built the SDK yourself
const OverledgerSDK = require('@quantnetwork/overledger-bundle/dist').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '...';
const bpiKey = '...';

const ethereumAddress = '0x650A87cfB9165C9F4Ccc7B971D971f50f753e761';
const xrpAddress = 'rhTa8RGotyJQAW8sS2tFVVfvcHYXaps9hC';

// Note: You cannot retrieve a Bitcoin address balance unless a wallet is integrated. This is due to Bitcoin being a UTXO-based distributed ledger

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: DltNameOptions.ethereum }, { dlt: DltNameOptions.xrp }],
            provider: { network: 'testnet' },
        });

        const xrpAddressBalance = await overledger.dlts.ripple.getBalance(xrpAddress);
        console.log('XRP ledger address balance:\n', xrpAddressBalance.data);
        console.log("");

        const ethereumAddressBalance = await overledger.dlts.ethereum.getBalance(ethereumAddress);
        console.log('Ethereum address balance:\n', ethereumAddressBalance.data);
        console.log("");
    } catch (e) {
        console.error('error', e);
    }
})();
