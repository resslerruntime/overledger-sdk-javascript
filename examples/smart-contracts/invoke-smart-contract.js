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
const partyAEthereumPrivateKey = '0xB4949F205AEAFB7E61E3C2D4BE42F6703A79FED92FAD2B5EC6DA4A118486B3C7';
const partyAEthereumAddress = '0x20c109A79d0c161e6AE72E8c8e5A0aFeD28e8bd0';
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
                value: [true,false,true], //value of the boolean (only options are 'true' or 'false')
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
            compLimit: '6000000', // must be an integer
            compUnitPrice: '80000000' // must be an integer
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

