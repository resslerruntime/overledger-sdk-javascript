// Replace the dependency by @quantnetwork/overledger-bundle if you're in your own project
const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const DltNames = require('@quantnetwork/overledger-dlt-abstract/dist/AbstractDLT').DltNames;
const TransactionTypeOptions = require('@quantnetwork/overledger-dlt-abstract/dist/AbstractDLT').TransactionTypeOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = 'network.quant.software';
const bpiKey = 'bpikeytest';

// Paste in your ethereum and ripple private keys.
// For Ethereum you can generate an account using `OverledgerSDK.dlts.ethereum.createAccount` then fund the address at the Ropsten Testnet Faucet.
const partyAEthereumPrivateKey = '0xD63E032AB4D8CDA9C29BD7DD331F69E400FF7FBDB590FC6DA5AEE32975E53EAB'; //should have 0x in front
const partyAEthereumAddress = '0xb5edb7f5F4e8133E90c2DEcF16cbeCD72C39621F'; //Xsender
// For Ripple, you can go to the official Ripple Testnet Faucet to get an account already funded.
const partyARipplePrivateKey = 'ssMCrzD2j1GjXmy3KuLaAd7MUVZph';
const partyARippleAddress = 'rMQbAYHCjRsb6TT58ujn4o2jTfXdF2fQdx';

// Keep in mind that for Ripple, the minimum transfer amount is 20XRP (20,000,000 drops), if the address is not yet funded.
const partyBEthereumAddress = '0x1a90dbb13861a29bFC2e464549D28bE44846Dbe4';
const partyBRippleAddress = 'rHVsZPVPjYJMR3Xa8YH7r7MapS7s5cyqgB';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
  try {
    const overledger = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: 'ethereum' }, { dlt: 'ripple' }],
      provider: { network: 'testnet' },
    });

    const transactionMessage = 'A Transaction Test';

    // SET partyA accounts for signing;
    overledger.dlts.ethereum.setAccount(partyAEthereumPrivateKey);
    overledger.dlts.ripple.setAccount(partyARipplePrivateKey);

    // Get the address sequences.
    const ethereumSequenceRequest = await overledger.dlts.ethereum.getSequence(partyAEthereumAddress);
    const rippleSequenceRequest = await overledger.dlts.ripple.getSequence(partyARippleAddress);
    const ethereumAccountSequence = ethereumSequenceRequest.data.dltData[0].sequence;
    const rippleAccountSequence = rippleSequenceRequest.data.dltData[0].sequence;


    // Sign the transactions.
    const signedTransactions = await overledger.sign([
    {
      // In order to prepare an ethereum transaction offline, we have to specify the sequence (nonce), a feePrice (gasPrice) and feeLimit (gasLimit).
      dlt: DltNames.ethereum,
      toAddress: partyBEthereumAddress,
      transactionType: TransactionTypeOptions.valueTransfer,
      message: transactionMessage,
      options: {
        amount: '0', // On Ethereum you can send 0 amount transactions. But you still pay network fees
        sequence: ethereumAccountSequence, // Sequence starts at 0 for newly created addresses
        feePrice: '8000000000', // Price for each individual gas unit this transaction will consume
        feeLimit: '80000', // The maximum fee that this transaction will use
      },
    },
    {
      // In order to prepare a ripple transaction offline, we have to specify a fee, sequence and maxLedgerVersion.
      dlt: DltNames.xrp,
      toAddress: partyBRippleAddress,
      message: transactionMessage,
      transactionType: TransactionTypeOptions.valueTransfer,
      options: {
        amount: '1', // Minimum allowed amount of drops is 1.
        sequence: rippleAccountSequence, // Sequence increases by 1 with each transaction and starts at 1 right after getting the address from the XRP testnet faucet.
        feePrice: '12', // Minimum feePrice on Ripple is 12 drops.
        maxLedgerVersion: '4294967295', // The maximum ledger version the transaction can be included in.
      },
    },]);

    //console.log("Signed transactions: ");
    //console.log(JSON.stringify(signedTransactions, null, 2));

    // Send the transactions to Overledger.
    const result = (await overledger.send(signedTransactions)).data;

    // Log the result.
    console.log(JSON.stringify(result, null, 2));

  } catch (e) {
    console.error('error:', e);
  }
})();