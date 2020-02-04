// Replace the dependency by @quantnetwork/overledger-bundle if you're in your own project
const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const SCFunctionTypeOptions = require('@quantnetwork/overledger-types').SCFunctionTypeOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;
const TransactionSubTypeOptions = require('@quantnetwork/overledger-types').TransactionSubTypeOptions;
const EthereumUintIntOptions = require('@quantnetwork/overledger-dlt-ethereum').EthereumUintIntOptions;
const EthereumBytesOptions = require('@quantnetwork/overledger-dlt-ethereum').EthereumBytesOptions;
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

    //query with no input
    let smartContractQuery1 = {
      id: smartContractAddress,
      code: "", //no need to put code here if you are declaring the function call
      functionCall: [{
        functionType: SCFunctionTypeOptions.functionCallWithNoParameters,
        functionName: "getOVLTestUint", //not needed for constructor
        inputParams: [],
        outputParams: [
          {  
            type: {selectedType: EthereumTypeOptions.uintB, selectedIntegerLength: EthereumUintIntOptions.b256}, //first parameter is an integer
          }
        ]
      }],
      extraFields: {
        //from SmartContractEthereum
        payable: false
      }
    } 

  const ethereumSmartContractQueryBuild1 = overledger.dlts.ethereum.buildSmartContractQuery(partyAEthereumAddress,smartContractQuery1);

  console.log("ethereumSmartContractQueryBuild1: "  + JSON.stringify(ethereumSmartContractQueryBuild1));
  if (ethereumSmartContractQueryBuild1.success == false){
    throw new Error(`Ethereum smart contract build unsuccessful: ` + ethereumSmartContractQueryBuild1.response);      
  }
  const returnedValues = await overledger.search.smartContractQuery(DltNameOptions.ethereum, ethereumSmartContractQueryBuild1.response);
  console.log(`returned output values for getOVLTestUint`,  returnedValues.data);

    //query with input
    let smartContractQuery2 = {
      id: smartContractAddress,
      code: "", //no need to put code here if you are declaring the function call
      functionCall: [{
        functionType: SCFunctionTypeOptions.functionCallWithParameters,
        functionName: "getTestArray", //not needed for constructor
        inputParams: [
          {  
            type: {selectedType: EthereumTypeOptions.uintB, selectedIntegerLength: EthereumUintIntOptions.b256},
            value: '0'
          }
        ],
        outputParams: [
          {  
            type: {selectedType: EthereumTypeOptions.bool}
          }
        ]
      }],
      extraFields: {
        //from SmartContractEthereum
        payable: false
      }
    } 

    const ethereumSmartContractQueryBuild2 = overledger.dlts.ethereum.buildSmartContractQuery(partyAEthereumAddress,smartContractQuery2);

    console.log("ethereumSmartContractQueryBuild2: "  + JSON.stringify(ethereumSmartContractQueryBuild2));
    if (ethereumSmartContractQueryBuild2.success == false){
      throw new Error(`Ethereum smart contract build unsuccessful: ` + ethereumSmartContractQueryBuild2.response);      
    }
 
      console.log('\n');
      const returnedValues2 = await overledger.search.smartContractQuery(DltNameOptions.ethereum, ethereumSmartContractQueryBuild2.response);
      console.log(`returned output values for getTestArray`,  returnedValues2.data);

  } catch (e) {
    console.error('error:', e);
  }
})();

