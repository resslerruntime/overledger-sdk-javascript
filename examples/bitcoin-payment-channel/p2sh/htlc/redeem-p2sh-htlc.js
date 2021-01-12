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

const partyABitcoinAddress = '2NAqorer9D2i3kSMGv3XRKfqtLQgXBSN4KY';
const bitcoinLinkedTx = 'fbe00f24bbf51c6984dd0c9783fde042561948680ab3fc7bc32161af0ad2e14f'; // Add the previous transaction here
const bitcoinLinkedIndex = '0'; // Add the linked transaction index here
const bitcoinInputAmount = 10000; // set equal to the number of satoshis in your first input
const bitcoinPartyBAmount = 7800; // set equal to the number of satoshis to send to party B
const bitcoinChangeAmount = 0; // set equal to the number of satoshis to send back to yourself 
                                // ( must be equal to 'total input amount' - 'party B amount' - extraFields.feePrice )

// Now provide three other addresses that you will be transfering value too
const partyBBitcoinAddress = 'mxvHBCNoT8mCP7MFaERVuBy9GMzmHcR9hj';
const partyBBitcoinPrivateKey = 'cQYWyycWa8KXRV2Y2c82NYPjdJuSy7wpFMhauMRVNNPFxDyLaAdn';

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
    overledger.dlts.bitcoin.setAccount(partyBBitcoinPrivateKey);

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
          amount: bitcoinInputAmount,
          scriptPubKey: 'a914c1048d8fa8e577320e44ae57f8367abbc83132e487',
          redeemScript: 'a914c1678ba6b9cb17819bdca55c3d0e2aae4d4a97d9876321037475473e1e509bfd85dd7384d95dcb817b71f353b0e3d73616517747e98a26f167038c0b1db17521035b71e0ec7329c32acf0a86eaa62e88951818021c9ff893108ef5b3103db3222168ac',
          rawTransaction: '0200000001a0da06c0a56defd45e73be95b43dc5960dc163e5ada712007e32b345e6e2ebd6000000006b483045022100afaf51663dbb36e85c36b733e34cd180a34978ceeddb327004a58258e25f721202205f8e1da8ad7ee1f271eb4051817905d09f97716564173ebc1190406cb8f27cb90121035b71e0ec7329c32acf0a86eaa62e88951818021c9ff893108ef5b3103db32221ffffffff02102700000000000017a914c1048d8fa8e577320e44ae57f8367abbc83132e487bac60f00000000001976a91400406a26567183b9b3e42e5fed00f70a2d11428188ac00000000',
          preimage: 'quantbitcoinpaymentchannel',
          transferType: 'REDEEM-HTLC'
        }
      ],
      txOutputs: [ // Set as many outputs as required
        { 
          scriptType: TransactionBitcoinScriptTypeOptions.P2PKH,
          toAddress: partyBBitcoinAddress,
          amount: bitcoinPartyBAmount 
        },
        {
          scriptType: TransactionBitcoinScriptTypeOptions.P2PKH,
          toAddress: partyBBitcoinAddress, // This is the change address
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