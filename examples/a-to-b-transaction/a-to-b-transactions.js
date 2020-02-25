const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;
const TransactionBitcoinSubTypeOptions = require('@quantnetwork/overledger-dlt-bitcoin').TransactionBitcoinSubTypeOptions;
const TransactionEthereumSubTypeOptions = require('@quantnetwork/overledger-dlt-ethereum').TransactionEthereumSubTypeOptions;
const TransactionXRPSubTypeOptions = require('@quantnetwork/overledger-dlt-ripple').TransactionXRPSubTypeOptions;
//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '...';
const bpiKey = '...';

// Paste in your bitcoin, ethereum and XRP ledger private keys.

// For Bitcoin you can generate an account using `OverledgerSDK.dlts.bitcoin.createAccount` then fund the address at the Bitcoin Testnet Faucet.
const partyABitcoinPrivateKey = 'cVRJipj585NeirnEt2q2CYrvonQLzQNRNQsh1vMaSAqXJTN5bQDR'; 
const partyABitcoinAddress = 'mgRvRj22C38dusBc8xqViKn168CCgHFzgv';
const partyAs2ndBitcoinPrivateKey = 'cNmsFjPqWCaVdhbPoHQJqDpayYdtKR9Qo81KVAEMHJwmgRVJZjDu';
const partyAs2ndBitcoinAddress = 'mo54poo7oLL5LvHEYwhDmYdCpqvx7j3Ks2'; // Nominate a Bitcoin address you own for the change to be returned to
const bitcoinLinkedTx = '...'; // Add the previous transaction here
const bitcoinLinkedIndex = '...'; // Add the linked transaction index here
const bitcoinInputAmount = 0; // set equal to the number of satoshis in your first input
const bitcoinPartyBAmount = 0; // set equal to the number of satoshis to send to party B
const bitcoinChangeAmount = 0; // set equal to the number of satoshis to send back to yourself 
                                // ( must be equal to 'total input amount' - 'party B amount' - extraFields.feePrice )

// For Ethereum you can generate an account using `OverledgerSDK.dlts.ethereum.createAccount` then fund the address at the Ropsten Testnet Faucet.
const partyAEthereumPrivateKey = '0xe352ad01a835ec50ba301ed7ffb305555cbf3b635082af140b3864f8e3e443d3'; //should have 0x in front
const partyAEthereumAddress = '0x650A87cfB9165C9F4Ccc7B971D971f50f753e761';

// For the XRP ledger, you can go to the official XRP Testnet Faucet to get an account already funded.
// Keep in mind that for XRP the minimum transfer amount is 20XRP (20,000,000 drops), if the address is not yet funded.
const partyAxrpPrivateKey = 'sswERuW1KWEwMXF6VFpRY72PxfC9b';
const partyAxrpAddress = 'rhTa8RGotyJQAW8sS2tFVVfvcHYXaps9hC';

// Now provide three other addresses that you will be transfering value too
const partyBBitcoinAddress = 'mtHsSjGeVhSQVqcM3fv5A79qoSJ5TgEjtj';
const partyBEthereumAddress = '0xB3ea4D180f31B4000F2fbCC58a085eF2ffD5a763';
const partyBxrpAddress = 'rKoGTTkPefCuQR31UHsfk9jKnrQHz6LtKe';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
  try {
    // Connect to overledger and choose which distributed ledgers to use:
    const overledger = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: DltNameOptions.bitcoin }, { dlt: DltNameOptions.ethereum }, { dlt: DltNameOptions.xrp }],
      provider: { network: 'testnet' },
    });
    const transactionMessage = 'OVL SDK Test';

    // SET partyA accounts for signing;
    overledger.dlts.bitcoin.setAccount(partyABitcoinPrivateKey);
    overledger.dlts.ethereum.setAccount(partyAEthereumPrivateKey);
    overledger.dlts.ripple.setAccount(partyAxrpPrivateKey);
    
    // Get the address sequences.
    const ethereumSequenceRequest = await overledger.dlts.ethereum.getSequence(partyAEthereumAddress);
    const xrpSequenceRequest = await overledger.dlts.ripple.getSequence(partyAxrpAddress);
    const ethereumAccountSequence = ethereumSequenceRequest.data.dltData[0].sequence;
    const xrpAccountSequence = xrpSequenceRequest.data.dltData[0].sequence;

    // Sign the transactions.
    // As input to this function, we will be providing:
    //  (1) a TransactionBitcoinRequest object (of @quantnetwork/overledger-dlt-bitcoin) that inherits from the TransactionUtxoRequest object which inherits from the TransactionRequest object (both of @quantnetwork/overledger-types)
    //  (2) a TransactionEthereumRequest object (of @quantnetwork/overledger-dlt-ethereum) that inherits from the TransactionAccountRequest object which inherits from the TransactionRequest object (both of @quantnetwork/overledger-types)
    //  (3) a TransactionXRPRequest object (of @quantnetwork/overledger-dlt-ripple) that inherits from the TransactionAccountRequest object which inherits from the TransactionRequest object (both of @quantnetwork/overledger-types)
    const signedTransactions = await overledger.sign([
    {
          // The following parameters are from the TransactionRequest object:
      dlt: DltNameOptions.bitcoin,
      type: TransactionTypeOptions.utxo,
      subType: {name: TransactionBitcoinSubTypeOptions.valueTransfer},
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
          toAddress: partyAs2ndBitcoinAddress, // This is the change address
          amount: bitcoinChangeAmount 
        }
      ],
      extraFields: {
              // The following parameters are from the TransactionBitcoinRequest object:
        feePrice: '2500' // Price for the miner to add this transaction to the block
      },
    },
    {
            // The following parameters are from the TransactionRequest object:
      dlt: DltNameOptions.ethereum,
      type: TransactionTypeOptions.accounts,
      subType: {name: TransactionEthereumSubTypeOptions.valueTransfer},
      message: transactionMessage,
            // The following parameters are from the TransactionAccountRequest object:
      fromAddress: partyAEthereumAddress,
      toAddress: partyBEthereumAddress,
      sequence: ethereumAccountSequence, // Sequence starts at 0 for newly created addresses
      amount: '0', // On Ethereum you can send 0 amount transactions. But you still pay network fees
      extraFields: {
              // The following parameters are from the TransactionEthereumRequest object:
        compUnitPrice: '8000000000', // Price for each individual gas unit this transaction will consume
        compLimit: '80000', // The maximum fee that this transaction will use
      },
    },
    {
            // The following parameters are from the TransactionRequest object:
      dlt: DltNameOptions.xrp,
      type: TransactionTypeOptions.accounts,
      subType: { name: TransactionXRPSubTypeOptions.valueTransfer },
      message: transactionMessage,
            // The following parameters are from the TransactionAccountRequest object:
      fromAddress: partyAxrpAddress,
      toAddress: partyBxrpAddress,
      sequence: xrpAccountSequence, // Sequence starts at 0 for newly created addresses
      amount: '1', // Minimum allowed amount of drops is 1.      
      extraFields: {
                      // The following parameters are from the TransactionXRPRequest object:
        feePrice: '12', // Minimum feePrice on XRP Ledger is 12 drops.
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
    console.log("");
    console.log('Your Bitcoin value transfer transaction hash is: ' + result.dltData[0].transactionHash);
    console.log("");
    console.log('Your Ethereum value transfer transaction hash is: ' + result.dltData[1].transactionHash);
    console.log("");
    console.log('Your XRP ledger value transfer transaction hash is: ' + result.dltData[2].transactionHash);
    console.log("");
  } catch (e) {
    console.error('error:', e);
  }
})();