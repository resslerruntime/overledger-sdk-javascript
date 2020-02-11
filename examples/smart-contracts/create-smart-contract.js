const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const SCFunctionTypeOptions = require('@quantnetwork/overledger-types').SCFunctionTypeOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;
const TransactionEthereumSubTypeOptions = require('@quantnetwork/overledger-dlt-ethereum').TransactionEthereumSubTypeOptions;
const EthereumUintIntOptions = require('@quantnetwork/overledger-dlt-ethereum').EthereumUintIntOptions;
const EthereumBytesOptions = require('@quantnetwork/overledger-dlt-ethereum').EthereumBytesOptions;
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

//This is the bytecode of demoSmartContract.sol - note that it must start with 0x, for it to be deployed correctly
const smartContractDemoCode = "0x60806040523480156200001157600080fd5b5060405162000c8f38038062000c8f833981810160405260e08110156200003757600080fd5b810190808051906020019092919080519060200190929190805190602001909291908051906020019092919080519060200190929190805160405193929190846401000000008211156200008a57600080fd5b83820191506020820185811115620000a157600080fd5b8251866001820283011164010000000082111715620000bf57600080fd5b8083526020830192505050908051906020019080838360005b83811015620000f5578082015181840152602081019050620000d8565b50505050905090810190601f168015620001235780820380516001836020036101000a031916815260200191505b50604052602001805160405193929190846401000000008211156200014757600080fd5b838201915060208201858111156200015e57600080fd5b82518660208202830111640100000000821117156200017c57600080fd5b8083526020830192505050908051906020019060200280838360005b83811015620001b557808201518184015260208101905062000198565b50505050905001604052505050866000806101000a81548160ff0219169083151502179055508560018190555084600260006101000a81548161ffff021916908361ffff1602179055508360038190555082600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600590805190602001906200025f92919062000286565b508060069080519060200190620002789291906200030d565b505050505050505062000415565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620002c957805160ff1916838001178555620002fa565b82800160010185558215620002fa579182015b82811115620002f9578251825591602001919060010190620002dc565b5b509050620003099190620003ba565b5090565b82805482825590600052602060002090601f01602090048101928215620003a75791602002820160005b838211156200037657835183826101000a81548160ff021916908315150217905550926020019260010160208160000104928301926001030262000337565b8015620003a55782816101000a81549060ff021916905560010160208160000104928301926001030262000376565b505b509050620003b69190620003e2565b5090565b620003df91905b80821115620003db576000816000905550600101620003c1565b5090565b90565b6200041291905b808211156200040e57600081816101000a81549060ff021916905550600101620003e9565b5090565b90565b61086a80620004256000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c8063a74006821161008c578063d41ed3c711610066578063d41ed3c7146103b0578063ea48e4bf146103de578063f0befa0014610400578063fa7a49551461041e576100ea565b8063a740068214610303578063a91f312914610321578063c6ca37fa1461036c576100ea565b80632d5ccf02116100c85780632d5ccf02146101915780632dc6f2581461020a5780632f91be481461025057806397012326146102d3576100ea565b8063114fd062146100ef5780632204251114610121578063288e94c814610147575b600080fd5b61011f6004803603602081101561010557600080fd5b81019080803561ffff169060200190929190505050610497565b005b6101296104b7565b604051808261ffff1661ffff16815260200191505060405180910390f35b61014f6104cf565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610208600480360360208110156101a757600080fd5b81019080803590602001906401000000008111156101c457600080fd5b8201836020820111156101d657600080fd5b803590602001918460018302840111640100000000831117156101f857600080fd5b90919293919293905050506104f9565b005b6102366004803603602081101561022057600080fd5b810190808035906020019092919050505061050f565b604051808215151515815260200191505060405180910390f35b610258610545565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561029857808201518184015260208101905061027d565b50505050905090810190601f1680156102c55780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610301600480360360208110156102e957600080fd5b810190808035151590602001909291905050506105e7565b005b61030b610603565b6040518082815260200191505060405180910390f35b61036a6004803603602081101561033757600080fd5b81019080803579ffffffffffffffffffffffffffffffffffffffffffffffffffff1916906020019092919050505061060d565b005b6103ae6004803603602081101561038257600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610634565b005b6103dc600480360360208110156103c657600080fd5b8101908080359060200190929190505050610678565b005b6103e6610682565b604051808215151515815260200191505060405180910390f35b610408610698565b6040518082815260200191505060405180910390f35b6104956004803603602081101561043457600080fd5b810190808035906020019064010000000081111561045157600080fd5b82018360208201111561046357600080fd5b8035906020019184602083028401116401000000008311171561048557600080fd5b90919293919293905050506106a2565b005b80600260006101000a81548161ffff021916908361ffff16021790555050565b6000600260009054906101000a900461ffff16905090565b6000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b81816005919061050a9291906106b8565b505050565b60006006828154811061051e57fe5b90600052602060002090602091828204019190069054906101000a900460ff169050919050565b606060058054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105dd5780601f106105b2576101008083540402835291602001916105dd565b820191906000526020600020905b8154815290600101906020018083116105c057829003601f168201915b5050505050905090565b806000806101000a81548160ff02191690831515021790555050565b6000600154905090565b8079ffffffffffffffffffffffffffffffffffffffffffffffffffff191660038190555050565b80600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b8060018190555050565b60008060009054906101000a900460ff16905090565b6000600354905090565b8181600691906106b3929190610738565b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106106f957803560ff1916838001178555610727565b82800160010185558215610727579182015b8281111561072657823582559160200191906001019061070b565b5b50905061073491906107e0565b5090565b82805482825590600052602060002090601f016020900481019282156107cf5791602002820160005b838211156107a0578335151583826101000a81548160ff0219169083151502179055509260200192600101602081600001049283019260010302610761565b80156107cd5782816101000a81549060ff02191690556001016020816000010492830192600103026107a0565b505b5090506107dc9190610805565b5090565b61080291905b808211156107fe5760008160009055506001016107e6565b5090565b90565b61083291905b8082111561082e57600081816101000a81549060ff02191690555060010161080b565b5090565b9056fea265627a7a723158208cc38bdb56113b5ff628cea7323edab95dafc95de6287b0a6a90f0aab1b8dfb064736f6c634300050c0032";


; (async () => {
  try {
    console.log("name is: " + DltNameOptions.ethereum);
    //initialise overledger with ethereum for this example
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
        subType: {name: TransactionEthereumSubTypeOptions.smartContractDeploy},
        message: "",  //This must be empty for a contractDeploy transaction
            //the following parameters are from the TransactionAccountRequest object:
        fromAddress: partyAEthereumAddress,
        toAddress: "", //This must be empty for a contractDeploy transaction
        sequence: ethereumAccountSequence, // must be an integer >= 0
        amount: '0', // must be an integer >= 0
        smartContract: {
          code: smartContractDemoCode, //put the bytecode to deploy here
          functionCall: [{
            functionType: SCFunctionTypeOptions.constructorWithParameters,
            functionName: "", //not needed for constructor
            inputParams: [
              {  
                type: {selectedType: EthereumTypeOptions.bool}, //first parameter is a boolean
                name: 'thisTestBool', //name of parameter
                value: 'true', //value of the boolean
            },
            {  
                type: {selectedType: EthereumTypeOptions.intB, selectedIntegerLength: EthereumUintIntOptions.b256} ,  //second parameter is an integer //if you choose an integer you must say what bit value to use
                name: 'thisTestInt',
                value: '5',
            },
            {  
                type: {selectedType: EthereumTypeOptions.uintB, selectedIntegerLength: EthereumUintIntOptions.b16},
                name: 'thisTestUInt',
                value: '33',
            },
            {  
                type: {selectedType: EthereumTypeOptions.bytesB, selectedBytesLength: EthereumBytesOptions.b32}, //fourth parameter is bytes //if you choose bytes you must say what bit value to use
                name: 'thisTestBytes',
                value: '0x68656c6c6f', //hello in bytes, 0x identifier required.
            },
            {  
                type: {selectedType: EthereumTypeOptions.address},
                name: 'thisTestAddress',
                value: '0x650A87cfB9165C9F4Ccc7B971D971f50f753e761', 
            },
            {  
                type: {selectedType: EthereumTypeOptions.string},
                name: 'thisTestString',
                value: 'Hi_there!', 
            },
            {
                type: {selectedType: EthereumTypeOptions.boolArray},
                name: 'thisTestArray',
                value: [true,false,true]
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
            compLimit: '4000000', // Price for each individual gas unit this transaction will consume
            compUnitPrice: '8000000000' // The maximum fee that this transaction will use
        }
      },
    ]);

    console.log('signedTransaction:');
    console.log(JSON.stringify(signedTransactions, null, 2));

    // Send the transactions to Overledger.
    const result = (await overledger.send(signedTransactions)).data;

    // Log the result.
    console.log('OVL result:');
    console.log(JSON.stringify(result, null, 2));
    console.log('\n');
    console.log('Your smart contract creation transaction hash is: ' + result.dltData[0].transactionHash);
    console.log('\n');
  } catch (e) {
    console.error('error:', e);
  }
})();

