const OverledgerSDK = require('@quantnetwork/overledger-bundle/dist').default;
const SCFunctionTypeOptions = require('@quantnetwork/overledger-types').SCFunctionTypeOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;
const TransactionEthereumSubTypeOptions = require('@quantnetwork/overledger-dlt-ethereum').TransactionEthereumSubTypeOptions;
const EthereumTypeOptions = require('@quantnetwork/overledger-dlt-ethereum').EthereumTypeOptions;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------

//The following are found from your Overledger Account:
const mappId = '...';
const bpiKey = '...';

// Paste in your ethereum address and private key.
const partyAEthereumPrivateKey = '...'; //should have 0x in front
const partyAEthereumAddress = '...';
//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

//a smart contract created earlier from the demoSmartContract.sol code
const smartContractAddress = '0x1BA73B0aE8CfB686f2C6Fa21571018Bca48Ec89d';

; (async () => {
  try {
    const overledger = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: DltNameOptions.ethereum }],
      provider: { network: 'testnet' },
    });

    // SET the signing key;
    overledger.dlts.ethereum.setAccount(partyAEthereumPrivateKey);

    // Get the address sequence.
    const ethereumSequenceRequest = await overledger.dlts.ethereum.getSequence(partyAEthereumAddress);
    const ethereumAccountSequence = ethereumSequenceRequest.data.dltData[0].sequence;

    console.error('ethereumAccountSequence:' + ethereumAccountSequence);

    // Sign the transaction.
    //As input to this function, we will be providing a TransactionEthereumRequest object (of @quantnetwork/overledger-dlt-ethereum) that inherits from the TransactionAccountRequest object which inherits from the TransactionRequest object (both of @quantnetwork/overledger-types)
    const signedTransactions = await overledger.sign([
      {
            //the following parameters are from the TransactionRequest object:
        dlt: DltNameOptions.ethereum,
        type: TransactionTypeOptions.accounts,
        subType: TransactionEthereumSubTypeOptions.smartContractInvocation,
        message: "",  //This must be empty for a contractInvocation transaction
            //the following parameters are from the TransactionAccountRequest object:
        fromAddress: partyAEthereumAddress,
        toAddress: smartContractAddress, 
        sequence: ethereumAccountSequence, // must be an integer >= 0
        amount: '0', // must be an integer >= 0
        smartContract: {
          code: "", //no need to put code here as you are declaring the function call ->
          functionCall: [{
            functionType: SCFunctionTypeOptions.functionCallWithParameters,
            functionName: "setOVLTestArray", //the function name must be given
            inputParams: [
              {  
                type: {selectedType: EthereumTypeOptions.boolArray}, //first parameter is a boolean array
                name: 'newArray', //name of parameter
                value: [true,true,true], //value of the boolean array
              }
            ]
          }

          ],
          extraFields: {
              //the following parameters are from the SmartContractEthereum object:
            payable: false
          }
        },
        extraFields: {
              //the following parameters are from the TransactionEthereumRequest object:
            compLimit: '4000000', // must be an integer
            compUnitPrice: '8000000000' // must be an integer
        }
      },
    ]);

    console.log('signedTransactions:');
    console.log(JSON.stringify(signedTransactions, null, 2));

    // Send the transactions to Overledger.
    const result = (await overledger.send(signedTransactions)).data;

    // Log the result.
    console.log('OVL result:');
    console.log(JSON.stringify(result, null, 2));
    console.log("");
    console.log('Your smart contract invocation transaction hash is: ' + result.dltData[0].transactionHash);
    console.log("");

  } catch (e) {
    console.error('error:', e);
  }
})();

