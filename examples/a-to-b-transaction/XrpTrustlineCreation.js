// Replace the dependency by @quantnetwork/overledger-bundle if you're in your own project
const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const TransactionXRPSubTypeOptions = require('@quantnetwork/overledger-dlt-ripple').TransactionXRPSubTypeOptions;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;

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
    const transactionMessage = 'Overledger JavaScript SDK Trustline Creation Test';

    // SET party A's corresponding private key that will be used for signing messages from his account;
    overledger.dlts.ripple.setAccount(partyAxrpPrivateKey);

    // Get party A's account sequences. XRP requires transactions to be sent from an account in seqeunce order, overledger finds the next correct sequence number
    const xrpSequenceRequest = await overledger.dlts.ripple.getSequence(partyAxrpAddress);
    const xrpAccountSequence = xrpSequenceRequest.data.dltData[0].sequence;


    // Sign the transactions.
    const signedTransactions = await overledger.sign([
      {
        // The following parameters are from the TransactionRequest object:
        dlt: DltNameOptions.XRP_LEDGER,
        type: TransactionTypeOptions.ACCOUNTS,
        subType: { name: TransactionXRPSubTypeOptions.TRUSTLINE_CREATE },
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
          currency: 'ETH',
          trustlineParameters: {
            maxCredit: '100',
            ripplingDisabled: true,
            frozen: false
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
