const OverledgerSDK = require("../../packages/bundle").default;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = 'network.quant.examples.a-to-b-transaction';
const bpiKey = 'DkucSXHTIKsNoT7EX9kfpvkVyorhSoa4odHLnYS-3f0';
//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: "bitcoin" }, { dlt: 'ethereum' }, { dlt: 'ripple' }],
            provider: { network: 'http://10.7.4.236:30020/v1' },

        });

        console.log(overledger);

        // CREATE partyA TESTNET ACCOUNTS
        console.log('\npartyA Testnet Accounts:');
        const partyABitcoinAccount = overledger.dlts.bitcoin.createAccount();
        const partyAEthereumAccount = overledger.dlts.ethereum.createAccount();
        const partyARippleAccount = overledger.dlts.ripple.createAccount();

        // SET partyA TESTNET ACCOUNTS FOR THIS SDK
        overledger.dlts.bitcoin.setAccount(partyABitcoinAccount.privateKey);
        overledger.dlts.ethereum.setAccount(partyAEthereumAccount.privateKey);
        overledger.dlts.ripple.setAccount(partyARippleAccount.privateKey);

        console.log('\n');
        console.log('partyA bitcoin address: ', partyABitcoinAccount.address);
        console.log('partyA bitcoin privateKey: ', partyABitcoinAccount.privateKey);
        console.log('\n');
        console.log('partyA ethereum address: ', partyAEthereumAccount.address);
        console.log('partyA ethereum privateKey: ', partyAEthereumAccount.privateKey);
        console.log('\n');
        console.log('partyA ripple address: ', partyARippleAccount.address);
        console.log('partyA ripple privateKey: ', partyARippleAccount.privateKey);

        // FUND partyA TESTNET ACCOUNTS
        console.log('\nBitcoin faucet: ', (await overledger.dlts.bitcoin.fundAccount()).data);
        console.log('\nEthereum faucet: ', (await overledger.dlts.ethereum.fundAccount()).data);
        console.log('\nRipple faucet: ', (await overledger.dlts.ripple.fundAccount()).data);


    } catch (e) {
        console.error('error', e);
    }
})();