const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const SCFunctionTypeOptions = require('@quantnetwork/overledger-types').SCFunctionTypeOptions;
const EthereumUintIntOptions = require('@quantnetwork/overledger-dlt-ethereum').EthereumUintIntOptions;
const EthereumTypeOptions = require('@quantnetwork/overledger-dlt-ethereum').EthereumTypeOptions;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------

// The following are found from your Overledger Account:
const mappId = '...';
const bpiKey = '...';

// Paste in your ethereum address.
const partyAEthereumAddress = '...';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

// A smart contract created earlier from the demoSmartContract.sol code
const smartContractAddress = '0x1BA73B0aE8CfB686f2C6Fa21571018Bca48Ec89d';

; (async () => {
  try {
    const overledger = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: DltNameOptions.ethereum }],
      provider: { network: 'testnet' },
    });

    // We will be providing a SmartContractEthereum object (of @quantnetwork/overledger-dlt-ethereum) that inherits from the SmartContract object (of @quantnetwork/overledger-types)
    // This smart contract object is querying a smart contract function that does not have an input
    let smartContractQuery1 = {
          // The following parameters are from the SmartContract object:
      id: smartContractAddress,
      code: "", // No need to put code here if you are declaring the function call ->
      functionCall: [{
        functionType: SCFunctionTypeOptions.functionCallWithNoParameters,
        functionName: "getOVLTestUint", // Not needed for constructor
        inputParams: [],
        outputParams: [
          {  
            type: {selectedType: EthereumTypeOptions.uintB, selectedIntegerLength: EthereumUintIntOptions.b256}, //first parameter is an integer
          }
        ]
      }],
      extraFields: {
          // The following parameters are from the SmartContractEthereum object:
        payable: false
      }
    } 

  // Now we will use the above smart contract object to build our Ethereum smart contract query
  const ethereumSmartContractQueryBuild1 = overledger.dlts.ethereum.buildSmartContractQuery(partyAEthereumAddress,smartContractQuery1);

  if (ethereumSmartContractQueryBuild1.success == false){
    throw new Error(`Ethereum smart contract build unsuccessful: ` + ethereumSmartContractQueryBuild1.response);      
  }

  // And finally we will send the smart contract function query to the node.
  const returnedValues = await overledger.search.smartContractQuery(DltNameOptions.ethereum, ethereumSmartContractQueryBuild1.response);
  console.log(`\n`);
  console.log(`returned output value for smart contract function 'getOVLTestUint'`,  returnedValues.data);
  console.log(`\n`);

    // We will be providing a SmartContractEthereum object (of @quantnetwork/overledger-dlt-ethereum) that inherits from the SmartContract object (of @quantnetwork/overledger-types)
    // This smart contract object is querying a smart contract function that does have an input
    let smartContractQuery2 = {
      id: smartContractAddress,
      code: "", // No need to put code here if you are declaring the function call
      functionCall: [{
        functionType: SCFunctionTypeOptions.functionCallWithParameters,
        functionName: "getTestArray", // Not needed for constructor
        inputParams: [
          {  
            type: {selectedType: EthereumTypeOptions.uintB, selectedIntegerLength: EthereumUintIntOptions.b256},
            value: '0',
            name: 'index'
          }
        ],
        outputParams: [
          {  
            type: {selectedType: EthereumTypeOptions.bool}
          }
        ]
      }],
      extraFields: {
        // From SmartContractEthereum
        payable: false
      }
    } 

    // Now we will use the above smart contract object to build our Ethereum smart contract query
    const ethereumSmartContractQueryBuild2 = overledger.dlts.ethereum.buildSmartContractQuery(partyAEthereumAddress,smartContractQuery2);

    if (ethereumSmartContractQueryBuild2.success == false){
      throw new Error(`Ethereum smart contract build unsuccessful: ` + ethereumSmartContractQueryBuild2.response);      
    }
 
    // And finally we will send the smart contract function query to the node.
    const returnedValues2 = await overledger.search.smartContractQuery(DltNameOptions.ethereum, ethereumSmartContractQueryBuild2.response);
    console.log(`returned output value for smart contract function 'getTestArray'`,  returnedValues2.data);
    console.log("");

  } catch (e) {
    console.error('error:', e);
  }
})();

