const OverledgerSDK = require('../../packages/bundle').default;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '<ENTER YOUR MAPPID>';
const bpiKey = '<ENTER YOUR BPIKEY>';

// Paste in credentials from the public testnet faucets for Party A.
// TODO: BITCOIN 
// const partyABitcoinPrivateKey = 'cSNgxoDKt65wBc96m5ugRkoVaBVQLTCodd1jtDuJrhWDYFuBvruq';
// const bitcoinFaucetMessageTxnHash = '010ff9bca3ed8f9b03d4f96979b6bfd6d383dba2958b4aebf3921d1de8dac811';
// const bitcoinFaucetMessageAmount = 100000000;
const partyAEthereumAddress = '0x4E33B9b03d1685eC90596c70fACE96Ac41382915';
const partyAEthereumPrivateKey = '39ed93f85c42b6e7655c2671b420065095f16f2210832bd61b9e27350049de52';

const partyARippleAddress = 'rEuggJAHrA3RvepChNHMRT1HJy87mJaWHU';
const partyARipplePrivateKey = 'snucuNobb6RNsgx85ujiZe2Npn5Su';

// Paste in credentials from the public testnet faucets for Party B.
// const partyBBitcoinAddress = 'mtnuMGfkimA7LoPZ8QXcncYPYSByQJBBxM';
const partyBEthereumAddress = '0x1a90dbb13861a29bFC2e464549D28bE44846Dbe4';
const partyBRippleAddress = 'rHVsZPVPjYJMR3Xa8YH7r7MapS7s5cyqgB';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
  try {
    const overledger = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: 'bitcoin' }, { dlt: 'ethereum' }, { dlt: 'ripple' }],
      provider: { network: 'testnet' },
    });

    const transactionMessage = 'Overledger JavaScript SDK Test';

    // SET partyA ACCOUNTS FOR SIGNING;
    // overledger.dlts.bitcoin.setAccount(partyABitcoinPrivateKey);
    overledger.dlts.ethereum.setAccount(partyAEthereumPrivateKey);
    overledger.dlts.ripple.setAccount(partyARipplePrivateKey);

    // const bitcoinSignedTransaction = await overledger.sign(
    //     {
    //         dlt: 'bitcoin',
    //         toAddress: partyBBitcoinAddress,
    //         message: transactionMessage,
    //         options: {
    //             amount: 546, // Minimum allowed amount of satoshi
    //             sequence: 0, //Bitcoin Faucet Message Vout, from when funding the address
    //             // TODO: This fee price is required when you put the output of the transaction
    //             feePrice: 100000, // is this fee price set? Should an endpoint be called beforehand? How is it calculated?
    //             previousTransactionHash: bitcoinFaucetMessageTxnHash,
    //             value: bitcoinFaucetMessageAmount, // This value is used to calculate the output amount
    //         }
    //     });

    const signedTransactions = await overledger.sign([
    {
      dlt: 'ethereum',
      toAddress: partyBEthereumAddress,
      message: transactionMessage,
      options: {
        amount: '0', // On Ethereum you can send 0 amount transactions. But you still pay network fees
        sequence: 0, // Sequence starts at 0 for newly created addresses
        feePrice: '10000000000', // Price for each individual gas unit this transaction
        feeLimit: '8000000', // The maximum fee that this transaction can use (can be set by the user)
      },
    },
    {
      //In order to prepare a transaction offline, we have to specify a fee, sequence and maxLedgerVersion.
      dlt: 'ripple',
      toAddress: partyBRippleAddress,
      message: transactionMessage,
      options: {
        amount: '1', // Minimum allowed amount of drops is 1.
        sequence: 10, // Sequence increases by 1 with each transaction and starts at 1 right after getting the address from the XRP testnet faucet.
        feePrice: '12', // Minimum feePrice on Ripple is 12 drops.
        maxLedgerVersion: '4294967295', // The maximum ledger version the transaction can be included in.
      },
    },]);

    console.log(JSON.stringify(signedTransactions, null, 2));


    //const result = (await overledger.send(signedTransactions)).data;
    //console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('error:', e);
  }
})();
