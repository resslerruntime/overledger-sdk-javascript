const OverledgerSDK = require("../../packages/bundle").default;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '<ENTER YOUR MAPPID>';
const bpiKey = '<ENTER YOUR BPIKEY>';
//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
    try {
        const overledger = new OverledgerSDK(mappId, bpiKey, {
            dlts: [{ dlt: "bitcoin" }, { dlt: 'ethereum' }, { dlt: 'ripple' }],
        });

        console.log(overledger);

        // CREATE partyB TESTNET ACCOUNTS
        console.log('\npartyB Testnet Accounts:');
        const partyBBitcoinAccount = overledger.dlts.bitcoin.createAccount();
        const partyBEthereumAccount = overledger.dlts.ethereum.createAccount();
        const partyBRippleAccount = overledger.dlts.ripple.createAccount();

        // SET partyB TESTNET ACCOUNTS FOR THIS SDK
        overledger.dlts.bitcoin.setAccount(partyBBitcoinAccount.privateKey);
        overledger.dlts.ethereum.setAccount(partyBEthereumAccount.privateKey);
        overledger.dlts.ripple.setAccount(partyBRippleAccount.privateKey);

        console.log('\n');
        console.log('partyB bitcoin address: ', partyBBitcoinAccount.address);
        console.log('partyB bitcoin privateKey: ', partyBBitcoinAccount.privateKey);
        console.log('\n');
        console.log('partyB ethereum address: ', partyBEthereumAccount.address);
        console.log('partyB ethereum privateKey: ', partyBEthereumAccount.privateKey);
        console.log('\n');
        console.log('partyB ripple address: ', partyBRippleAccount.address);
        console.log('partyB ripple privateKey: ', partyBRippleAccount.privateKey);

        // FUND partyB TESTNET ACCOUNTS
        console.log('\nBitcoin faucet: ', (await overledger.dlts.bitcoin.fundAccount()).data);
        console.log('\nEthereum faucet: ', (await overledger.dlts.ethereum.fundAccount()).data);
        console.log('\nRipple faucet: ', (await overledger.dlts.ripple.fundAccount()).data);


    } catch (e) {
        console.error('error', e);
    }
})();
