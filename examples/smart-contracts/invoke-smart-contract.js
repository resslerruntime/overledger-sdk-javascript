const OverledgerSDK = require('@quantnetwork/overledger-bundle/dist').default;
const SCFunctionTypeOptions = require('@quantnetwork/overledger-types').SCFunctionTypeOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;const TypeOptions = require('@quantnetwork/overledger-types').TypeOptions;
const DltNames = require('@quantnetwork/overledger-dlt-abstract/dist/AbstractDLT').DltNames;
const PayableOptions = require('@quantnetwork/overledger-types').PayableOptions;

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

    // Get the address sequences.
    const ethereumSequenceRequest = await overledger.dlts.ethereum.getSequence(partyAEthereumAddress);
    const ethereumAccountSequence = ethereumSequenceRequest.data.dltData[0].sequence;

    console.error('ethereumAccountSequence:' + ethereumAccountSequence);

    // Sign the transactions.
    const signedTransactions = await overledger.sign([
      {
        // In order to prepare an ethereum transaction offline, we have to specify the sequence (nonce), a feePrice (gasPrice) and feeLimit (gasLimit).
        dlt: DltNames.ethereum,
        toAddress: smartContractAddress, // the smart contract address
        transactionType: TransactionTypeOptions.smartContractInvocation,
        options: {
          amount: '0', // must be an integer >= 0
          sequence: ethereumAccountSequence, // must be an integer >= 0
          feePrice: '80000000', // must be an integer
          feeLimit: '6000000', // must be an integer
          functionDetails: { //when smartContractInvocation is used, this section is necessary 
            functionType: SCFunctionTypeOptions.functionCall,
            functionName: 'setOVLTestArray', //when smartContractInvocation is used, this section is necessary 
            payable: PayableOptions.notPayable, //default is false
            functionParameters:  //Both contract deploy and invocation use function parameters
              [
                {  
                  type: TypeOptions.boolArray,
                  name: 'newArray',
                  value: [false,true,false],
                }
              ]
          }
        },
      },
    ]);

    //console.log('signedTransactions:');
    //console.log(JSON.stringify(signedTransactions, null, 2));

    // Send the transactions to Overledger.
    const result = (await overledger.send(signedTransactions)).data;

    // Log the result.
    console.log(JSON.stringify(result, null, 2));

  } catch (e) {
    console.error('error:', e);
  }
})();

