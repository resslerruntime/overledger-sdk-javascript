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

const partyABitcoinAddress = '2Mtfpk3Wzjq7bEeyvMH51YzKf1mK12hzMzm';
const bitcoinLinkedTx = '5eb54d6b5c725e09216ebcb0efb4442a8fca49c062b392274cf03d8a6ec48c11'; // Add the previous transaction here
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
          scriptPubKey: 'a9140f9f1ed5ec59f95fd386190756608b82bccb712987',
          redeemScript: '5221035b71e0ec7329c32acf0a86eaa62e88951818021c9ff893108ef5b3103db3222121037475473e1e509bfd85dd7384d95dcb817b71f353b0e3d73616517747e98a26f121038058beafa6e35ab4a0b5a99c783aa6581d344ca72c0711657acef3460c6ce3cb53ae',
          rawTransaction: '0200000001a37b0abae10075175984e381bff2b3b77931fa0cf5e1d27d5d9abbb7b542f43e010000006a473044022063fde40ca6ca2c601441e4780309d347df31068d2a52c07e3194b61c7a51cac70220527c8f153e0d849e86b6ddd1ac7ea9a4ef76d58f1e4fe7d77e90a937d0798a510121035b71e0ec7329c32acf0a86eaa62e88951818021c9ff893108ef5b3103db32221ffffffff02102700000000000017a9140f9f1ed5ec59f95fd386190756608b82bccb712987b7681900000000001976a91400406a26567183b9b3e42e5fed00f70a2d11428188ac00000000',
          transferType: 'REDEEM-P2SH-P2MS'
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