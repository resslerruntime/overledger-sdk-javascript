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
const partyAEthereumAddress = '0x3EE0778D7a2be8E91c0e62C74621Cb7622F5987e';
const partyAEthereumPrivateKey = '0x28bfd56677735aa4b910ab33a3721de439297c3eb568cf2d92584938516577db';

const partyARippleAddress = 'rBHLNSvsnR9RXcAVWuCk69zCjrkvK5e2Fx';
const partyARipplePrivateKey = 'snTes4KoZ96bwkozry1t6AgNnZDig';

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
    const ethereumSignedTransaction = await overledger.sign({
      dlt: 'ethereum',
      toAddress: partyBEthereumAddress,
      message: transactionMessage,
      options: {
        amount: '0', // On Ethereum you can send 0 amount transactions. But you still pay network fees
        sequence: 0, // Sequence starts at 0 after funding
        feePrice: '21000', // This is the minimum fee price in Ethereum
        feeLimit: '2100000', // The maximum fee that this transaction can use (can be set by the user)
      }
    });
    const rippleSignedTransaction = await overledger.sign({
      dlt: 'ripple',
      toAddress: partyBRippleAddress,
      message: transactionMessage,
      options: {
        amount: '1', // Minimum allowed amount of drops
        sequence: 1, // Sequence increases by 1 with each transaction
        feePrice: '12', // Minimum feePrice on Ripple
        maxLedgerVersion: '4294967295', // The maximum ledger version the transaction can be included in.
      }
    });

    const overledgerSignedTransactions = [{
      dlt: 'ethereum',
      fromAddress: partyAEthereumAddress,
      amount: 0,
      signedTransaction: {
        signatures : [],
        transactions: [ethereumSignedTransaction],
      }
    },
    {
      dlt: 'ripple',
      fromAddress: partyARippleAddress,
      amount: 1,
      signedTransaction: {
        signatures : [],
        transactions: [rippleSignedTransaction],
      }
    }];


    const result = (await overledger.send(overledgerSignedTransactions)).data;
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('error', e.response.data);
  }
})();
