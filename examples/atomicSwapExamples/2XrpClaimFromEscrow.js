// Replace the dependency by @quantnetwork/overledger-bundle if you're in your own project
const OverledgerSDK = require('../../packages/overledger-bundle').default;
const TransactionXRPSubTypeOptions = require('../../packages/overledger-dlt-ripple').TransactionXRPSubTypeOptions;
const DltNameOptions = require('../../packages/overledger-types').DltNameOptions;
const TransactionTypeOptions = require('../../packages/overledger-types').TransactionTypeOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------

//The following are found from your Overledger Account:
const mappId = '';
const bpiKey = '';

// This example, shows how to create an escrow on XRP between two parties A and B.
// Paste in the two parties XRP addresses (also known as account) and party A's private key.
// To generate XRP test accounts, you can go to the official Ripple Testnet Faucet to get a prefunded one.

//Party B will be the executor of the escrow. Party 's details are as follows:
const partyBxrpPrivateKey = 'sn9d8ZT6Z2BBshBU4jJxKeF8Ghq8Q';
const partyBxrpAddress = 'rQDc5RRkwRwQFrgrk7iMCt5wYKB8Gmjv8q';

// Party A's details are as follows:
const partyAxrpAddress = 'rhTa8RGotyJQAW8sS2tFVVfvcHYXaps9hC';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
  try {
    //connect to overledger and choose the XRP distributed ledger:
    const overledger = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: DltNameOptions.XRP_LEDGER }],
      provider: { network: 'testnet' },
    });

    //You can add a message that will be encorporated into the transaction (this is additional to the escrow functionality):
    const transactionMessage = 'Overledger JavaScript SDK Escrow Execution Test';

    // SET party A's corresponding private key that will be used for signing messages from his account;
    overledger.dlts.ripple.setAccount(partyBxrpPrivateKey);

    // Get party A's account sequences. XRP requires transactions to be sent from an account in seqeunce order, overledger finds the next correct sequence number
    const xrpSequenceRequest = await overledger.dlts.ripple.getSequence(partyBxrpAddress);
    const xrpAccountSequence = xrpSequenceRequest.data.dltData[0].sequence;

    // Sign the transactions.
    const signedTransactions = await overledger.sign([
      {
        // The following parameters are from the TransactionRequest object:
        dlt: DltNameOptions.XRP_LEDGER,
        type: TransactionTypeOptions.ACCOUNTS,
        subType: { name: TransactionXRPSubTypeOptions.ESCROW_CLAIM },
        message: transactionMessage,
              // The following parameters are from the TransactionAccountRequest object:
        fromAddress: partyBxrpAddress,
        toAddress: partyAxrpAddress,
        sequence: xrpAccountSequence, // Sequence starts at 0 for newly created addresses
        amount: '1', // Minimum allowed amount of drops is 1.      
        extraFields: {
                        // The following parameters are from the TransactionXRPRequest object:
          feePrice: '12', // Minimum feePrice on XRP Ledger is 12 drops.
          maxLedgerVersion: '4294967295', // The maximum ledger version the transaction can be included in.
          atomicSwapParameters: {
            owner: partyAxrpAddress, //Who created the escrow
            escrowSequence: '342', //The sequence number of the escrow creation transaction. This can be either found from the transaction search using Overledger's search package or from a testnet explorer online
            hashAlgorithmInputString: 'Test' //This is the hash algorithm input. In the escrowExecution transaction type, this will now be written onto the XRP ledger so that the escrow is executed.    
          }
        },
      },]);

    // The signed transaction can now be sent to Overledger.
    const result = (await overledger.send(signedTransactions)).data;

    // Log the result.
    console.log(JSON.stringify(result, null, 2));

  } catch (e) {
    console.error('error:', e);
  }
})();
