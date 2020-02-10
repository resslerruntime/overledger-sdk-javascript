const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;
const TransactionSubTypeOptions = require('@quantnetwork/overledger-types').TransactionSubTypeOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '...';
const bpiKey = '...';


// Paste in your ethereum and ripple private keys.
// For Ethereum you can generate an account using `OverledgerSDK.dlts.ethereum.createAccount` then fund the address at the Ropsten Testnet Faucet.
const partyAEthereumPrivateKey = '...'; //should have 0x in front
const partyAEthereumAddress = '...'; //Xsender
// For Ripple, you can go to the official Ripple Testnet Faucet to get an account already funded.
// Keep in mind that for Ripple, the minimum transfer amount is 20XRP (20,000,000 drops), if the address is not yet funded.
const partyARipplePrivateKey = '...';
const partyARippleAddress = '...';

//now provide two other addresses that you will be transfering value too
const partyBEthereumAddress = '...';
const partyBRippleAddress = '...';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
  try {
    const overledger = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: 'bitcoin' }, { dlt: 'ethereum' }, { dlt: 'ripple' }],
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
    //As input to this function, we will be providing:
    //  (1) a TransactionEthereumRequest object (of @quantnetwork/overledger-dlt-ethereum) that inherits from the TransactionAccountRequest object which inherits from the TransactionRequest object (both of @quantnetwork/overledger-types)
    //  (2) a TransactionXRPRequest object (of @quantnetwork/overledger-dlt-ripple) that inherits from the TransactionAccountRequest object which inherits from the TransactionRequest object (both of @quantnetwork/overledger-types)
    const signedTransactions = await overledger.sign([
      //{
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
        //     },
    {
            //the following parameters are from the TransactionRequest object:
      dlt: DltNameOptions.ethereum,
      type: TransactionTypeOptions.accounts,
      subType: TransactionSubTypeOptions.valueTransfer,
      message: transactionMessage,
            //the following parameters are from the TransactionAccountRequest object:
      fromAddress: partyAEthereumAddress,
      toAddress: partyBEthereumAddress,
      sequence: ethereumAccountSequence, // Sequence starts at 0 for newly created addresses
      amount: '0', // On Ethereum you can send 0 amount transactions. But you still pay network fees
      extraFields: {
              //the following parameters are from the TransactionEthereumRequest object:
        compUnitPrice: '8000000000', // Price for each individual gas unit this transaction will consume
        compLimit: '80000', // The maximum fee that this transaction will use
      },
    },
    {
            //the following parameters are from the TransactionRequest object:
      dlt: DltNameOptions.xrp,
      type: TransactionTypeOptions.accounts,
      subType: TransactionSubTypeOptions.valueTransfer,
      message: transactionMessage,
            //the following parameters are from the TransactionAccountRequest object:
      fromAddress: partyARippleAddress,
      toAddress: partyBRippleAddress,
      sequence: rippleAccountSequence, // Sequence starts at 0 for newly created addresses
      amount: '1', // Minimum allowed amount of drops is 1.      
      extraFields: {
                      //the following parameters are from the TransactionXRPRequest object:
        feePrice: '12', // Minimum feePrice on Ripple is 12 drops.
        maxLedgerVersion: '4294967295', // The maximum ledger version the transaction can be included in.
      },
    },]);

    console.log("Signed transactions: ");
    console.log(JSON.stringify(signedTransactions, null, 2));

    // Send the transactions to Overledger.
    const result = (await overledger.send(signedTransactions)).data;

    // Log the result.
    console.log('OVL result:');
    console.log(JSON.stringify(result, null, 2));
    console.log('\n');
    console.log('Your Ethereum value transfer transaction hash is: ' + result.dltData[0].transactionHash);
    console.log('\n');
    console.log('Your XRP value transfer transaction hash is: ' + result.dltData[1].transactionHash);
    console.log('\n');
  } catch (e) {
    console.error('error:', e);
  }
})();