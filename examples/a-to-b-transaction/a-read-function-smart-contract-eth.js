// Replace the dependency by @quantnetwork/overledger-bundle if you're in your own project
const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
TypeOptions = require('@quantnetwork/overledger-types').TypeOptions;
const UintIntMOptions = require('@quantnetwork/overledger-types').UintIntMOptions;
const BytesMOptions = require('@quantnetwork/overledger-types').BytesMOptions;
const DltNames = require('@quantnetwork/overledger-dlt-abstract/dist/AbstractDLT').DltNames;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------

//The following are found from your Overledger Account:
const mappId = '<ENTER YOUR MAPPID>';
const bpiKey = '<ENTER YOUR BPIKEY>';

// Paste in your ethereum and ripple private keys.
// For Ethereum you can generate an account using `OverledgerSDK.dlts.ethereum.createAccount` then fund the address at the Ropsten Testnet Faucet.
const partyAEthereumPrivateKey = '0xcbf05d5215b7f37b3cd1577280c45381393116a81c053abbe21afdbd5d0e504d';
const partyAEthereumAddress = '0x0E4e8278ACa5EFEc8430692108B5271961A00ec7'

const partyBEthereumAddress = '0x1a90dbb13861a29bFC2e464549D28bE44846Dbe4';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------


; (async () => {
  try {
    const overledger = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: DltNames.ethereum }],
      provider: { network: 'testnet' },
    });

    const transactionMessage = 'Overledger JavaScript SDK Test';

    // SET partyA accounts for signing;
    overledger.dlts.ethereum.setAccount(partyAEthereumPrivateKey);

    // Get the address sequences.
    const ethereumSequenceRequest = await overledger.dlts.ethereum.getSequence(partyAEthereumAddress);
    const ethereumAccountSequence = ethereumSequenceRequest.data.dltData[0].sequence;

    console.error('ethereumAccountSequence:' + ethereumAccountSequence);

    let contractAddress = "0xBDA545C5Fc4c5DFD385AC5E6c3513eDDD74AB028";

  const input = {
    fromAddress: partyAEthereumAddress,
    contractAddress,
    functionName: 'getVariable1',
    functionParameters: {
     inputValues: [
       {  
      type: TypeOptions.uintM,
      uintIntMValue: UintIntMOptions.m256,
      value: '3',
      }
    ],
    outputTypes: [
      {  
        type: TypeOptions.uintM,
        uintIntMValue: UintIntMOptions.m256,
        }
    ]
  }
  }  

  const returnedValues = await overledger.search.queryContract(DltNames.ethereum, input.fromAddress, input.contractAddress, input.functionName, input.functionParameters.inputValues, input.functionParameters.outputTypes);
  console.log(`returned output values `,  returnedValues);

  } catch (e) {
    console.error('error:', e);
  }
})();

