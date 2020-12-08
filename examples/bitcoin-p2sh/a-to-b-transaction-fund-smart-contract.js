//NOTE: replace @quantnetwork/ with ../../packages/ for all require statements below if you have not built the SDK yourself
const bitcoin = require('bitcoinjs-lib');
const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;
const TransactionBitcoinSubTypeOptions = require('@quantnetwork/overledger-dlt-bitcoin').TransactionBitcoinSubTypeOptions;
const TransactionEthereumSubTypeOptions = require('@quantnetwork/overledger-dlt-ethereum').TransactionEthereumSubTypeOptions;
const TransactionXRPSubTypeOptions = require('@quantnetwork/overledger-dlt-ripple').TransactionXRPSubTypeOptions;
//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = 'network.quant.testnet';
const bpiKey = 'joNp29bJkQHwEwP3FmNZFgHTqCmciVu5NYD3LkEtk1I';

// Paste in your bitcoin, ethereum and XRP ledger private keys.

// For Bitcoin you can generate an account using `OverledgerSDK.dlts.bitcoin.createAccount` then fund the address at the Bitcoin Testnet Faucet.
const partyABitcoinPrivateKey = 'cQYWyycWa8KXRV2Y2c82NYPjdJuSy7wpFMhauMRVNNPFxDyLaAdn';
const partyABitcoinAddress = 'mxvHBCNoT8mCP7MFaERVuBy9GMzmHcR9hj';
const bitcoinLinkedTx = '2b591108b4089b04936ca97f3683a448d5a68490a17b52b4bc272cd272e76eea'; // Add the previous transaction here
const bitcoinLinkedIndex = '0'; // Add the linked transaction index here
const bitcoinInputAmount = 100000; // set equal to the number of satoshis in your first input
const bitcoinPartyBAmount = 10000; // set equal to the number of satoshis to send to party B
const bitcoinChangeAmount = 87800; // set equal to the number of satoshis to send back to yourself 
                                // ( must be equal to 'total input amount' - 'party B amount' - extraFields.feePrice )

// Now provide three other addresses that you will be transfering value too
const partyBBitcoinAddress = '32UgbH1uoEo3jzY2vdsBjhP1yv9W6UMab1';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
  try {
    // Connect to overledger and choose which distributed ledgers to use:
    const overledger = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: DltNameOptions.BITCOIN }],
      provider: { network: 'testnet' },
    });
    const transactionMessage = 'OVL SDK Test';

    // SET partyA accounts for signing;
    overledger.dlts.bitcoin.setAccount(partyABitcoinPrivateKey);

    const signedTransactions = await overledger.sign([
    {
          // The following parameters are from the TransactionRequest object:
      dlt: DltNameOptions.BITCOIN,
      type: TransactionTypeOptions.UTXO,
      subType: {name: TransactionBitcoinSubTypeOptions.VALUE_TRANSFER},
      message: transactionMessage,
            // The following parameters are from the TransactionUtxoRequest object:
      txInputs: [ // Set as many inputs as required in order to fund your outputs
        {
          linkedTx: bitcoinLinkedTx,
          linkedIndex: bitcoinLinkedIndex,
          fromAddress: partyABitcoinAddress,
          amount: bitcoinInputAmount 
        }
      ],
      txOutputs: [ // Set as many outputs as required
        { 
          toAddress: partyBBitcoinAddress,
          amount: bitcoinPartyBAmount 
        },
        {
          toAddress: partyABitcoinAddress, // This is the change address
          amount: bitcoinChangeAmount 
        }
      ],
      extraFields: {
              // The following parameters are from the TransactionBitcoinRequest object:
        feePrice: '2200' // Price for the miner to add this transaction to the block
      },
    },
    // {
    //         // The following parameters are from the TransactionRequest object:
    //   dlt: DltNameOptions.ETHEREUM,
    //   type: TransactionTypeOptions.ACCOUNTS,
    //   subType: {name: TransactionEthereumSubTypeOptions.VALUE_TRANSFER},
    //   message: transactionMessage,
    //         // The following parameters are from the TransactionAccountRequest object:
    //   fromAddress: partyAEthereumAddress,
    //   toAddress: partyBEthereumAddress,
    //   sequence: ethereumAccountSequence, // Sequence starts at 0 for newly created addresses
    //   amount: '0', // On Ethereum you can send 0 amount transactions. But you still pay network fees
    //   extraFields: {
    //           // The following parameters are from the TransactionEthereumRequest object:
    //     compUnitPrice: '8000000000', // Price for each individual gas unit this transaction will consume
    //     compLimit: '80000', // The maximum fee that this transaction will use
    //   },
    // },
    // {
    //         // The following parameters are from the TransactionRequest object:
    //   dlt: DltNameOptions.XRP_LEDGER,
    //   type: TransactionTypeOptions.ACCOUNTS,
    //   subType: { name: TransactionXRPSubTypeOptions.VALUE_TRANSFER },
    //   message: transactionMessage,
    //         // The following parameters are from the TransactionAccountRequest object:
    //   fromAddress: partyAxrpAddress,
    //   toAddress: partyBxrpAddress,
    //   sequence: xrpAccountSequence, // Sequence starts at 0 for newly created addresses
    //   amount: '1', // Minimum allowed amount of drops is 1.      
    //   extraFields: {
    //                   // The following parameters are from the TransactionXRPRequest object:
    //     feePrice: '12', // Minimum feePrice on XRP Ledger is 12 drops.
    //     maxLedgerVersion: '4294967295', // The maximum ledger version the transaction can be included in.
    //   },
    // },
  ]);

    console.log("Signed transactions: ");
    console.log(JSON.stringify(signedTransactions, null, 2));

    // Send the transactions to Overledger.
    const result = (await overledger.send(signedTransactions)).data;

    // Log the result.
    console.log('OVL result:');
    console.log(JSON.stringify(result, null, 2));
    console.log("");
    counter = 0;
    while (counter < result.dltData.length){
      console.log('Your ' + result.dltData[counter].dlt + ' value transfer transaction hash is: ' + result.dltData[counter].transactionHash);
      console.log("");
      counter = counter + 1;
    }
  } catch (e) {
    console.error('error:', e);
  }
})();


// f305d9acee40131d19c22e4978c3872e2fcc3eff6089593746c6e95a233489a8