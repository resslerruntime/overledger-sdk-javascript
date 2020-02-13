const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;
const TransactionBitcoinSubTypeOptions = require('@quantnetwork/overledger-dlt-bitcoin').TransactionBitcoinSubTypeOptions;
const TransactionEthereumSubTypeOptions = require('@quantnetwork/overledger-dlt-ethereum').TransactionEthereumSubTypeOptions;
const TransactionXRPSubTypeOptions = require('@quantnetwork/overledger-dlt-ripple').TransactionXRPSubTypeOptions;
//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = 'network.quant.software';
const bpiKey = 'bpikeytest';


// Paste in your bitcoin, ethereum and ripple private keys.
// For Bitcoin you can generate an account using `OverledgerSDK.dlts.bitcoin.createAccount` then fund the address at the Bitcoin Testnet Faucet.
const partyABitcoinPrivateKey = 'cNfaxhH4XxKaHWFZZDhbAcWcZq4qDdpuCtbCHo9T6yAhC8YGWAqV'; //should have 0x in front
const partyABitcoinAddress = 'mmhJJqp1o2w5GR9CCgn8VMXjcNEgcTu3iA'; 
const partyAs2ndBitcoinPrivateKey = 'cVpfBYcHDY8sR9YpgWMs2wv3CdMiqSt8XZQzeB93dWdzrsbYoaQy'; //should have 0x in front
const partyAs2ndBitcoinAddress = 'mrCHRbJ9fU9zrk5of2dj3Kk5fsyvPWREoq'; //nominate a Bitcoin address you own for the change to be returned to
// For Ethereum you can generate an account using `OverledgerSDK.dlts.ethereum.createAccount` then fund the address at the Ropsten Testnet Faucet.
const partyAEthereumPrivateKey = '0xB4949F205AEAFB7E61E3C2D4BE42F6703A79FED92FAD2B5EC6DA4A118486B3C7'; //should have 0x in front
const partyAEthereumAddress = '0x20c109A79d0c161e6AE72E8c8e5A0aFeD28e8bd0'; 
// For Ripple, you can go to the official Ripple Testnet Faucet to get an account already funded.
// Keep in mind that for Ripple, the minimum transfer amount is 20XRP (20,000,000 drops), if the address is not yet funded.
const partyARipplePrivateKey = 'shrQbu8sZtCChEejY8cg5ZqY3wK1m';
const partyARippleAddress = 'rPs726xarcP21tU4tb1md51Nb9HDPCh4Wy';

//now provide two other addresses that you will be transfering value too
const partyBBitcoinAddress = 'mvRNyc5WnGCvjf8mdzh119vR2Q1DZyuZSR';
const partyBEthereumAddress = '0x74269e7c9D1e3f3937E8aF7b62Bc0B7795f15C1A';
const partyBRippleAddress = 'rhn2U3QAPCQHuqPvPf75FYfRJeVFrteWM2';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
  try {
    const overledger = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: DltNameOptions.bitcoin }, { dlt: DltNameOptions.ethereum }, { dlt: DltNameOptions.xrp }],
      provider: { network: 'testnet' },
    });
    const transactionMessage = 'OVL SDK Test';

    // SET partyA accounts for signing;
    overledger.dlts.bitcoin.setAccount(partyABitcoinPrivateKey);
    overledger.dlts.ethereum.setAccount(partyAEthereumPrivateKey);
    overledger.dlts.ripple.setAccount(partyARipplePrivateKey);
    // Get the address sequences.
    //const ethereumSequenceRequest = await overledger.dlts.ethereum.getSequence(partyAEthereumAddress);
    //const rippleSequenceRequest = await overledger.dlts.ripple.getSequence(partyARippleAddress);
    const ethereumAccountSequence = 1;//ethereumSequenceRequest.data.dltData[0].sequence;
    const rippleAccountSequence = 1;//rippleSequenceRequest.data.dltData[0].sequence;
    // Sign the transactions.
    //As input to this function, we will be providing:
    //  (1) a TransactionBitcoinRequest object (of @quantnetwork/overledger-dlt-bitcoin) that inherits from the TransactionUtxoRequest object which inherits from the TransactionRequest object (both of @quantnetwork/overledger-types)
    //  (2) a TransactionEthereumRequest object (of @quantnetwork/overledger-dlt-ethereum) that inherits from the TransactionAccountRequest object which inherits from the TransactionRequest object (both of @quantnetwork/overledger-types)
    //  (3) a TransactionXRPRequest object (of @quantnetwork/overledger-dlt-ripple) that inherits from the TransactionAccountRequest object which inherits from the TransactionRequest object (both of @quantnetwork/overledger-types)
    const signedTransactions = await overledger.sign([
    {
          //the following parameters are from the TransactionRequest object:
      dlt: DltNameOptions.bitcoin,
      type: TransactionTypeOptions.utxo,
      subType: {name: TransactionBitcoinSubTypeOptions.valueTransfer},
      message: transactionMessage,
            //the following parameters are from the TransactionUtxoRequest object:
      txInputs: [
        {
          linkedTx: "f04fb35581ede6e031ec3ccbb9c876faf55f7148e078f5889e33e6b75fec250b",
          linkedIndex: "0",
          fromAddress: partyABitcoinAddress, 
          amount: 149000 //in satoshis
        },        
        {
          linkedTx: "cea5a345dcb7cb891f79c9f64ded895d47b66976b13a3c239deeaa7851164979",
          linkedIndex: "1",
          fromAddress: "2MyxEmuqnogTJRcoAqUoPbpY4z1WQ1Fdanp", 
          amount: 1849625 //in satoshis
        }
      ],
      txOutputs: [
        {
          toAddress: partyAs2ndBitcoinAddress, 
          amount: 1996125 //in satoshis
        }/*,
        {
          toAddress: partyAs2ndBitcoinAddress, //the change address
          amount: 1513630 //in satoshis
        }*/
      ],
      extraFields: {
              //the following parameters are from the TransactionBitcoinRequest object:
        feePrice: '2500' // Price for the miner to add this transaction to the block
      },
    },
    {
            //the following parameters are from the TransactionRequest object:
      dlt: DltNameOptions.ethereum,
      type: TransactionTypeOptions.accounts,
      subType: {name: TransactionEthereumSubTypeOptions.valueTransfer},
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
      subType: {name: TransactionXRPSubTypeOptions.valueTransfer},
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
    console.log('Your Bitcoin value transfer transaction hash is: ' + result.dltData[0].transactionHash);
    console.log('\n');
    console.log('Your Ethereum value transfer transaction hash is: ' + result.dltData[1].transactionHash);
    console.log('\n');
    console.log('Your XRP value transfer transaction hash is: ' + result.dltData[2].transactionHash);
    console.log('\n');
  } catch (e) {
    console.error('error:', e);
  }
})();