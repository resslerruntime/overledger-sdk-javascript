const OverledgerSDK = require('@quantnetwork/overledger-bundle/dist').default;
const SCFunctionTypeOptions = require('@quantnetwork/overledger-types').SCFunctionTypeOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;
const TransactionSubTypeOptions = require('@quantnetwork/overledger-types').TransactionSubTypeOptions;
//const EthereumUintIntOptions = require('@quantnetwork/overledger-dlt-ethereum').EthereumUintIntOptions;
//const EthereumBytesOptions = require('@quantnetwork/overledger-dlt-ethereum').EthereumBytesOptions;
const EthereumTypeOptions = require('@quantnetwork/overledger-dlt-ethereum').EthereumTypeOptions;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------

//The following are found from your Overledger Account:
const mappId = 'network.quant.software';
const bpiKey = 'bpikeytest';

// Paste in your ethereum and ripple private keys.
// For Ethereum you can generate an account using `OverledgerSDK.dlts.ethereum.createAccount` then fund the address at the Ropsten Testnet Faucet.
const partyAEthereumPrivateKey = '0xD63E032AB4D8CDA9C29BD7DD331F69E400FF7FBDB590FC6DA5AEE32975E53EAB'; //should have 0x in front
const partyAEthereumAddress = '0xb5edb7f5F4e8133E90c2DEcF16cbeCD72C39621F';
const smartContractAddress = '0x1BA73B0aE8CfB686f2C6Fa21571018Bca48Ec89d';
//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------


; (async () => {
  try {
    const overledger = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: DltNameOptions.ethereum }],
      provider: { network: 'testnet' },
    });

    // SET partyA accounts for signing;
    overledger.dlts.ethereum.setAccount(partyAEthereumPrivateKey);

    // Get the address sequences.
    const ethereumSequenceRequest = await overledger.dlts.ethereum.getSequence(partyAEthereumAddress);
    const ethereumAccountSequence = ethereumSequenceRequest.data.dltData[0].sequence;

    console.error('ethereumAccountSequence:' + ethereumAccountSequence);

    // Sign the transactions.
    const signedTransactions = await overledger.sign([
      {
        //from TransactionRequest:
        dlt: DltNameOptions.ethereum,
        type: TransactionTypeOptions.accounts,
        subType: TransactionSubTypeOptions.smartContractInvocation,
        message: "",  //This must be empty for a contractInvocation transaction
        //from TransactionAccountsRequest:
        fromAddress: partyAEthereumAddress,
        toAddress: smartContractAddress, 
        sequence: ethereumAccountSequence, // must be an integer >= 0
        amount: '0', // must be an integer >= 0
        smartContract: {
          code: "", //no need to put code here if you are declaring the function call
          functionCall: [{
            functionType: SCFunctionTypeOptions.functionCallWithParameters,
            functionName: "setOVLTestArray", //not needed for constructor
            inputParams: [
              {  
                type: {selectedType: EthereumTypeOptions.boolArray}, //first parameter is a boolean
                name: 'newArray', //name of parameter
                value: [true,true,true], //value of the boolean (only options are 'true' or 'false')
              }
            ]
          }

          ],
          extraFields: {
            //from SmartContractEthereum
            payable: false
          }
        },
        extraFields: {
            //from TransactionEthereumRequest:
            compLimit: '4000000', // must be an integer
            compUnitPrice: '8000000000' // must be an integer
        }
      },
    ]);

    //console.log('signedTransactions:');
    console.log(JSON.stringify(signedTransactions, null, 2));

    // Send the transactions to Overledger.
    const result = (await overledger.send(signedTransactions)).data;

    // Log the result.
    console.log(JSON.stringify(result, null, 2));

  } catch (e) {
    console.error('error:', e);
  }
})();

