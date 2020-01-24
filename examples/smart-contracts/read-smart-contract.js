// Replace the dependency by @quantnetwork/overledger-bundle if you're in your own project
const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
TypeOptions = require('@quantnetwork/overledger-types').TypeOptions;
const UintIntBOptions = require('@quantnetwork/overledger-types').UintIntBOptions;
const DltNames = require('@quantnetwork/overledger-dlt-abstract/dist/AbstractDLT').DltNames;

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
      dlts: [{ dlt: DltNames.ethereum }],
      provider: { network: 'testnet' },
    });

    // SET partyA accounts for signing;
    overledger.dlts.ethereum.setAccount(partyAEthereumPrivateKey);

    //query with no input
  const input = {
    fromAddress: partyAEthereumAddress,
    contractAddress: smartContractAddress,
    functionName: 'getOVLTestUint',
    functionParameters: {
     inputValues: [
    ],
    outputTypes: [
      {  
        type: TypeOptions.uintB,
        uintIntBValue: UintIntBOptions.b16,
        }
    ]
  }
  }  

  const returnedValues = await overledger.search.queryContract(DltNames.ethereum, input.fromAddress, input.contractAddress, input.functionName, input.functionParameters.inputValues, input.functionParameters.outputTypes);
  console.log(`returned output values for getOVLTestUint`,  returnedValues.data);

      //query with input
      const input2 = {
        fromAddress: partyAEthereumAddress,
        contractAddress: smartContractAddress,
        functionName: 'getTestArray',
        functionParameters: {
         inputValues: [
          {  
            type: TypeOptions.uintB,
            uintIntBValue: UintIntBOptions.b256,
            value: '0',
            }
        ],
        outputTypes: [
          {  
            type: TypeOptions.bool,
            }
        ]
      }
      }  
      console.log('\n');
      const returnedValues2 = await overledger.search.queryContract(DltNames.ethereum, input2.fromAddress, input2.contractAddress, input2.functionName, input2.functionParameters.inputValues, input2.functionParameters.outputTypes);
      console.log(`returned output values for getTestArray`,  returnedValues2.data);

  } catch (e) {
    console.error('error:', e);
  }
})();

