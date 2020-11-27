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

//Party A will be the creator of the escrow. Party A's details are as follows:
const partyAxrpPrivateKey = 'sswERuW1KWEwMXF6VFpRY72PxfC9b';
const partyAxrpAddress = 'rhTa8RGotyJQAW8sS2tFVVfvcHYXaps9hC';

// Party B's details are as follows:
const partyBxrpAddress = 'rQDc5RRkwRwQFrgrk7iMCt5wYKB8Gmjv8q';

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
    const transactionMessage = 'Overledger JavaScript SDK Escrow Creation Test';

    // SET party A's corresponding private key that will be used for signing messages from his account;
    overledger.dlts.ripple.setAccount({privateKey: partyAxrpPrivateKey});

    // Get party A's account sequences. XRP requires transactions to be sent from an account in seqeunce order, overledger finds the next correct sequence number
    const xrpSequenceRequest = await overledger.dlts.ripple.getSequence(partyAxrpAddress);
    const xrpAccountSequence = xrpSequenceRequest.data.dltData[0].sequence;

    //create time variables for use in the escrow
    let escrowExecutionAfter = new Date(Date.now() + (1*60000)); //set escrow execution 1 mins into the future
    let escrowCancelationAfter = new Date(Date.now() + (20*60000)); //set escrow cancelation 20 mins into the future
    console.log('escrowExecutionAfter: ' + escrowExecutionAfter.toISOString());
    console.log('escrowCancelationAfter: ' + escrowCancelationAfter.toISOString());

    // Sign the transactions.
    const signedTransactions = await overledger.sign([
      {
        // The following parameters are from the TransactionRequest object:
        dlt: DltNameOptions.XRP_LEDGER,
        type: TransactionTypeOptions.ACCOUNTS,
        subType: { name: TransactionXRPSubTypeOptions.ESCROW_CREATE },
        message: transactionMessage,
              // The following parameters are from the TransactionAccountRequest object:
        fromAddress: partyAxrpAddress,
        toAddress: partyBxrpAddress,
        sequence: xrpAccountSequence, // Sequence starts at 0 for newly created addresses
        amount: '23', // Minimum allowed amount of drops is 1.      
        extraFields: {
                        // The following parameters are from the TransactionXRPRequest object:
          feePrice: '12', // Minimum feePrice on XRP Ledger is 12 drops.
          maxLedgerVersion: '4294967295', // The maximum ledger version the transaction can be included in.
          atomicSwapParameters: {
            allowExecuteAfter: escrowExecutionAfter.toISOString(),//format required: '2019-19-15T15:36:01.325Z', //from when can the escrow be executed?
            allowCancelAfter: escrowCancelationAfter.toISOString(),//format required: '2019-19-14T18:00:01.325Z', //from when can the escrow be cancelled?
            hashAlgorithmInputString: 'Test' //This is the input to the hashing algorithm used to lock the escrow. This input will not be revealed on the ledger until escrow execution.  
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
