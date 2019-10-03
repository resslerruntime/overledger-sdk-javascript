// Replace the dependency by @overledger/bundle if you're in your own project
const OverledgerSDK = require('../../packages/bundle').default;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '<ENTER YOUR MAPPID>';
const bpiKey = '<ENTER YOUR BPIKEY>';

// Paste in your ethereum and ripple private keys.
// For Ethereum you can generate an account using `OverledgerSDK.dlts.ethereum.createAccount` then fund the address at the Ropsten testnet faucet.
const partyAEthereumPrivateKey = '39ed93f85c42b6e7655c2671b420065095f16f2210832bd61b9e27350049de52';
// For Ripple, you can go to the official ripple testnet faucet to get an account already funded.
const partyARipplePrivateKey = 'snucuNobb6RNsgx85ujiZe2Npn5Su';


const partyBEthereumAddress = '0x1a90dbb13861a29bFC2e464549D28bE44846Dbe4';
// Keep in mind that for Ripple, the minimum transfer amount is 20XRP (20 000 000 drops), if the address is unfunded.
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

    const transactionMessage = 'Overledger JavaScript SDK Test';

    // SET partyA accounts for signing;
    overledger.dlts.ethereum.setAccount(partyAEthereumPrivateKey);
    overledger.dlts.ripple.setAccount(partyARipplePrivateKey);

    // Sign the transactions.
    const signedTransactions = await overledger.sign([
    {
      // In order to prepare an ethereum transaction offline, we have to specify the sequence (nonce), a feePrice (gasPrice) and feeLimit (gasLimit).
      dlt: 'ethereum',
      toAddress: partyBEthereumAddress,
      message: transactionMessage,
      options: {
        amount: '0', // On Ethereum you can send 0 amount transactions. But you still pay network fees
        sequence: 1, // Sequence starts at 0 for newly created addresses
        feePrice: '1000', // Price for each individual gas unit this transaction will consume
        feeLimit: '8000000', // The maximum fee that this transaction can use (can be set by the user)
      },
    },
    {
      // In order to prepare a ripple transaction offline, we have to specify a fee, sequence and maxLedgerVersion.
      dlt: 'ripple',
      toAddress: partyBRippleAddress,
      message: transactionMessage,
      options: {
        amount: '1', // Minimum allowed amount of drops is 1.
        sequence: 1, // Sequence increases by 1 with each transaction and starts at 1 right after getting the address from the XRP testnet faucet.
        feePrice: '12', // Minimum feePrice on Ripple is 12 drops.
        maxLedgerVersion: '4294967295', // The maximum ledger version the transaction can be included in.
      },
    },]);
    
    console.log(signedTransactions[0].signedTransaction);

    // Send the transactions to Overledger.
    //const result = (await overledger.send(signedTransactions)).data;

    // Log the result.
    console.log(JSON.stringify(result, null, 2));

  } catch (e) {
    console.error('error:', e);
  }
})();
