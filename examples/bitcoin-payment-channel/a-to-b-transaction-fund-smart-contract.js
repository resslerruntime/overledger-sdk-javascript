//NOTE: replace @quantnetwork/ with ../../packages/ for all require statements below if you have not built the SDK yourself
const bitcoin = require('bitcoinjs-lib');
const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;
const TransactionBitcoinSubTypeOptions = require('@quantnetwork/overledger-dlt-bitcoin').TransactionBitcoinSubTypeOptions;
const TransactionBitcoinScriptTypeOptions = require('@quantnetwork/overledger-dlt-bitcoin').TransactionBitcoinScriptTypeOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = 'network.quant.testnet';
const bpiKey = 'joNp29bJkQHwEwP3FmNZFgHTqCmciVu5NYD3LkEtk1I';

// Paste in your bitcoin, ethereum and XRP ledger private keys.

// For Bitcoin you can generate an account using `OverledgerSDK.dlts.bitcoin.createAccount` then fund the address at the Bitcoin Testnet Faucet.
const partyABitcoinPrivateKey = 'cUk9izv1EPDSB2CJ7sf6RdVa6BDUWUBN8icE2LVW5ixvDApqBReT';
const partyABitcoinAddress = 'mfYHTfMs5ptQpWoefcdt9RWi3WTWGeSB7J';
const bitcoinLinkedTx = 'd6ebe2e645b3327e0012a7ade563c10d96c53db495be735ed4ef6da5c006daa0'; // Add the previous transaction here
const bitcoinLinkedIndex = '0'; // Add the linked transaction index here
const bitcoinInputAmount = 100000; // set equal to the number of satoshis in your first input
const bitcoinPartyBAmount = 10000; // set equal to the number of satoshis to send to party B
const bitcoinChangeAmount = 87800; // set equal to the number of satoshis to send back to yourself 
                                // ( must be equal to 'total input amount' - 'party B amount' - extraFields.feePrice )

// Now provide three other addresses that you will be transfering value too
const partyBBitcoinAddress = '3BhyPmWh9YtiqrWJe397g4Ksx4K4iNqapK';

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
      // scriptType: { name: ''}
      message: transactionMessage,
            // The following parameters are from the TransactionUtxoRequest object:
      txInputs: [ // Set as many inputs as required in order to fund your outputs
        {
          linkedTx: bitcoinLinkedTx,
          linkedIndex: bitcoinLinkedIndex,
          fromAddress: partyABitcoinAddress,
          rawTransaction: '020000000001011c2f05a306f15899aa4024030d4f1817182f6cb879efb2448f891e31818988eb01000000171600149166552c256635fdcb2a44629aa79e3f1350d4d3feffffff0262f60f00000000001976a91400406a26567183b9b3e42e5fed00f70a2d11428188ac69946a180100000017a914a15b83a0d0888f3001ca65f46848c113e6ca33c68702473044022036850c4716a5e994ab0e9f388677ca5d98ac00b0ecf1eb3ec4a2dce25aba8896022065a0cedf583c7072242d0021f5e3375ab60dee5cf971351294b79a5c47804719012103ff2c1cd0df2ccc779e64b4fd1c801b9c18604a4576beeb8f77c162f07b6c7e2850081d00',
          amount: bitcoinInputAmount 
        }
      ],
      txOutputs: [ // Set as many outputs as required
        {  
          scriptType: TransactionBitcoinScriptTypeOptions.P2SH,
          toAddress: partyBBitcoinAddress,
          script: 'a9146ddf8fb4b545035cee3474f99bb7bcb6b4d0f3da87',
          amount: bitcoinPartyBAmount 
        },
        {
          scriptType: TransactionBitcoinScriptTypeOptions.P2PKH,
          toAddress: partyABitcoinAddress, // This is the change address
          amount: bitcoinChangeAmount 
        }
      ],
      extraFields: {
              // The following parameters are from the TransactionBitcoinRequest object:
        feePrice: '2200' // Price for the miner to add this transaction to the block
      },
    }
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

// transaction id 
// d147ea01b9e1c803aeb0adc8c170c63cd1f60e7f3e4fb5b45a9b035f77a8b1bb