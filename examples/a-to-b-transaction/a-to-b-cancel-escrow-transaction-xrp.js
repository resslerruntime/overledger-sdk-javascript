// Replace the dependency by @quantnetwork/overledger-bundle if you're in your own project
const OverledgerSDK = require('../../packages/overledger-bundle/dist').default;
const TransactionTypes = require('../../packages/overledger-dlt-ripple/dist/Ripple').TransactionTypes;
//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = 'network.quant.software';
const bpiKey = 'bpikeytest';

// Paste in your ethereum and ripple private keys.
// For Ethereum you can generate an account using `OverledgerSDK.dlts.ethereum.createAccount` then fund the address at the Ropsten Testnet Faucet.
// For Ripple, you can go to the official Ripple Testnet Faucet to get an account already funded.
// const partyARipplePrivateKey = 'saw8418BRjNQkWiDak8szCySyDHvF';
// const partyARippleAddress = 'r38zfh4yzthZ51rGKzsGQgrUoQMiEzQx38'

const partyARipplePrivateKey = 'sstGk6CTepVHFkhGzJMnbiD5nPpCX';
const partyARippleAddress = 'rG2SF9T3M9Zbq6nBS5rbFn4MuZxB47VVk2'


// Keep in mind that for Ripple, the minimum transfer amount is 20XRP (20,000,000 drops), if the address is not yet funded.
const partyBRippleAddress = 'rP4MrmQcxnAAZusXGgnyZD4WR1Es5wjmLE';
const partyBRipplePrivateKey = 'sa3QfHx9dhMApSTJ5upjEC3ou3jhy';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
  try {
    const overledger = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: 'ripple' }],
      provider: { network: 'testnet' },
    });

    const transactionMessage = 'Overledger JavaScript SDK Test';

    // SET partyA accounts for signing;
    overledger.dlts.ripple.setAccount(partyBRipplePrivateKey);

    // Get the address sequences.
    const rippleSequenceRequest = await overledger.dlts.ripple.getSequence(partyBRippleAddress);
    const rippleAccountSequence = rippleSequenceRequest.data.dltData[0].sequence;


    // Sign the transactions.
    const signedTransactions = await overledger.sign([
    {
      // In order to prepare a ripple transaction offline, we have to specify a fee, sequence and maxLedgerVersion.
      dlt: 'ripple',
      toAddress: partyARippleAddress,
      message: transactionMessage,
      options: {
        amount: '100', // Minimum allowed amount of drops is 1.
        sequence: rippleAccountSequence, // Sequence increases by 1 with each transaction and starts at 1 right after getting the address from the XRP testnet faucet.
        feePrice: '12', // Minimum feePrice on Ripple is 12 drops.
        maxLedgerVersion: '4294967295', // The maximum ledger version the transaction can be included in.
        transactionType: TransactionTypes.escrowCancellation,
        atomicSwapParameters: {
          owner: partyARippleAddress,
          escrowSequence: '16'
        }
      },
    },]);

    // Send the transactions to Overledger.
    const result = (await overledger.send(signedTransactions)).data;

    // Log the result.
    console.log(JSON.stringify(result, null, 2));

  } catch (e) {
    console.error('error:', e);
  }
})();
