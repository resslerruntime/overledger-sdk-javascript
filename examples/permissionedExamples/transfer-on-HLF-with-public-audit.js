//NOTE: replace @quantnetwork/ with ../../packages/ for all require statements below if you have not built the SDK yourself
const OverledgerSDK = require('@quantnetwork/packages/overledger-bundle/dist').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const SCFunctionTypeOptions = require('@quantnetwork/overledger-types').SCFunctionTypeOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;
const TransactionEthereumSubTypeOptions = require('@quantnetwork/packages/overledger-dlt-ethereum/dist').TransactionEthereumSubTypeOptions;
const TransactionXRPSubTypeOptions = require('@quantnetwork/packages/overledger-dlt-ripple/dist').TransactionXRPSubTypeOptions;
const TransactionHyperledgerFabricSubTypeOptions = require('@quantnetwork/packages/overledger-dlt-hyperledger_fabric/dist').TransactionHyperledgerFabricSubTypeOptions;
const HyperledgerFabricTypeOptions = require('@quantnetwork/packages/overledger-dlt-hyperledger_fabric/dist').HyperledgerFabricTypeOptions;
//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '';
const bpiKey = '';

// For Ethereum you can generate an account using `OverledgerSDK.dlts.ethereum.createAccount` then fund the address at the Ropsten Testnet Faucet.
const partyAEthereumPrivateKey = '0xe352ad01a835ec50ba301ed7ffb305555cbf3b635082af140b3864f8e3e443d3'; //should have 0x in front
const partyAEthereumAddress = '0x650A87cfB9165C9F4Ccc7B971D971f50f753e761';

// For the XRP ledger, you can go to the official XRP Testnet Faucet to get an account already funded.
// Keep in mind that for XRP the minimum transfer amount is 20XRP (20,000,000 drops), if the address is not yet funded.
const partyAxrpPrivateKey = 'sswERuW1KWEwMXF6VFpRY72PxfC9b';
const partyAxrpAddress = 'rhTa8RGotyJQAW8sS2tFVVfvcHYXaps9hC';

//hyperledger fabric parameters
const fabricMSP = '';
const smartContractAddress = '';
const fabricAdminAddress = '';
const fabricSenderAddress = '';
const fabricReceiverAddress = '';
const fabricValueToSend = 0;
const fabricNetworkConnection = '';

// Now provide three other addresses that you will be transfering value too
const partyBEthereumAddress = '0xB3ea4D180f31B4000F2fbCC58a085eF2ffD5a763';
const partyBxrpAddress = 'rKoGTTkPefCuQR31UHsfk9jKnrQHz6LtKe';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
  try {

    // (STEP 1) Setup connection to overledger and choose which distributed ledgers to use:
    const overledgerPublicDLTs = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: DltNameOptions.BITCOIN }, { dlt: DltNameOptions.ETHEREUM }, { dlt: DltNameOptions.XRP_LEDGER }],
      provider: { network: 'testnet' },
    });
    const overledgerPermissionedDLTs = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: DltNameOptions.HYPERLEDGER_FABRIC }],
      provider: { network: fabricNetworkConnection },
    });

   overledgerPermissionedDLTs.dlts.hyperledger_fabric.setAccount({address: fabricAdminAddress, provider: fabricMSP});
 

    // (STEP 2) prepare for HLF asset transfer by querying current state (asset balances)

    let fabricSmartContractSenderBalanceQuery = {
          // The following parameters are from the SmartContract object:
      id: smartContractAddress,
      code: "", // No need to put code here if you are declaring the function call ->
      functionCall: [{
        functionType: SCFunctionTypeOptions.FUNCTION_CALL_WITH_NO_PARAMETERS,
        functionName: "balanceOf", // Not needed for constructor
        inputParams: [
          {  
            type: { selectedType: HyperledgerFabricTypeOptions.STRING }, // First parameter is a boolean array
            name: 'user', // Name of parameter
            value: fabricSenderAddress, // Value of the boolean array
          }
        ],
        outputParams: [
          {  
            type: {selectedType: HyperledgerFabricTypeOptions.INTEGER}, //first parameter is an integer
          }
        ]
      }],
      extraFields: {
          // The following parameters are from the SmartContractHyperledgerFabric object:
          connectionProfileJSON: 'connection-quant.json', // the name of the connection profile to access the hyperledger fabric node
          channelName: 'businesschannel', // the hyperledger fabric channel where the related smart contract is residing in
      }
  };

  let fabricSmartContractReceiverBalanceQuery = {
    // The following parameters are from the SmartContract object:
    id: smartContractAddress,
    code: "", // No need to put code here if you are declaring the function call ->
    functionCall: [{
      functionType: SCFunctionTypeOptions.FUNCTION_CALL_WITH_NO_PARAMETERS,
      functionName: "balanceOf", // Not needed for constructor
      inputParams: [
        {  
          type: { selectedType: HyperledgerFabricTypeOptions.STRING }, // First parameter is a boolean array
          name: 'user', // Name of parameter
          value: fabricReceiverAddress, // Value of the boolean array
        }
      ],
      outputParams: [
        {  
          type: {selectedType: HyperledgerFabricTypeOptions.INTEGER}, //first parameter is an integer
        }
      ]
    }],
    extraFields: {
        // The following parameters are from the SmartContractHyperledgerFabric object:
        connectionProfileJSON: 'connection-quant.json', // the name of the connection profile to access the hyperledger fabric node
        channelName: 'businesschannel', // the hyperledger fabric channel where the related smart contract is residing in
    }
    };

  const hyperledgerFabricSmartContractSenderBalanceQuery = overledgerPermissionedDLTs.dlts.hyperledger_fabric.buildSmartContractQuery(fabricAdminAddress,fabricSmartContractSenderBalanceQuery);
  const hyperledgerFabricSmartContractReceiverBalanceQuery = overledgerPermissionedDLTs.dlts.hyperledger_fabric.buildSmartContractQuery(fabricAdminAddress,fabricSmartContractReceiverBalanceQuery);

  if (hyperledgerFabricSmartContractSenderBalanceQuery.success == false){
    throw new Error(`Hyperledger Fabric smart contract query 1 build unsuccessful: ` + hyperledgerFabricSmartContractSenderBalanceQuery.response);      
  } else if (hyperledgerFabricSmartContractReceiverBalanceQuery.success == false){
    throw new Error(`Hyperledger Fabric smart contract query 2 build unsuccessful: ` + hyperledgerFabricSmartContractReceiverBalanceQuery.response);      
  }
  //get the current balances:
  //sender
  const senderBalanceObject = await overledgerPermissionedDLTs.search.smartContractQuery(DltNameOptions.HYPERLEDGER_FABRIC, hyperledgerFabricSmartContractSenderBalanceQuery.response);
  const senderBalance1 = senderBalanceObject.data.payload.response.balance;
  console.log(`\nBalance of: ` + fabricSenderAddress + ` = `+ senderBalance1.toString());
  //receiver    
  const receiverBalanceObject = await overledgerPermissionedDLTs.search.smartContractQuery(DltNameOptions.HYPERLEDGER_FABRIC, hyperledgerFabricSmartContractReceiverBalanceQuery.response);
  const receiverBalance1 = receiverBalanceObject.data.payload.response.balance;
  console.log(`\nBalance of: ` + fabricReceiverAddress + ` = `+ receiverBalance1.toString());
  sleep(5000);


    // (STEP 3) Perform asset transfer by adding a tx onto HLF
      //build hlf asset transfer tx as standard object
    let fabricTx = 
    {
          // The following parameters are from the TransactionRequest object:
      dlt: DltNameOptions.HYPERLEDGER_FABRIC,
      type: TransactionTypeOptions.ACCOUNTS,
      subType: { name: TransactionHyperledgerFabricSubTypeOptions.SMART_CONTRACT_INVOCATION },
      message: "",  // This must be empty for a contractInvocation transaction
          // The following parameters are from the TransactionAccountRequest object:
      fromAddress: fabricAdminAddress,
      toAddress: smartContractAddress, 
      sequence: '0', // Must be an integer >= 0
      smartContract: {
        code: "", // No need to put code here as you are declaring the function call ->
        functionCall: [{
          functionType: SCFunctionTypeOptions.FUNCTION_CALL_WITH_PARAMETERS,
          functionName: "transfer", // The function name must be given
          inputParams: [
            {  
              type: { selectedType: HyperledgerFabricTypeOptions.STRING }, // First parameter is a boolean array
              name: 'sender', // Name of parameter
              value: fabricSenderAddress, // Value of the boolean array
            },
            {  
              type: { selectedType: HyperledgerFabricTypeOptions.STRING }, // First parameter is a boolean array
              name: 'receiver', // Name of parameter
              value: fabricReceiverAddress, // Value of the boolean array
            },
            {  
              type: { selectedType: HyperledgerFabricTypeOptions.STRING }, // First parameter is a boolean array
              name: 'value', // Name of parameter
              value: fabricValueToSend.toString(), // Value of the boolean array
            }
          ]
        }
        ],
        extraFields: {
          // The following parameters are from the SmartContractHyperledgerFabric object:
          connectionProfileJSON: 'connection-quant.json', // the name of the connection profile to access the hyperledger fabric node
          channelName: 'businesschannel' // the hyperledger fabric channel where the related smart contract is residing in
        }
      },
      extraFields: {}
    }
    //validate standard object for HLF transaction
    let validation = overledgerPermissionedDLTs.dlts.hyperledger_fabric._transactionValidation(fabricTx);
    if (validation.success === false){
      throw "Validation error field: " + validation.failingField +"\nValidation error reason: " + validation.error;
    }
    //build hlf specific transaction
    let formattedFabricTx = overledgerPermissionedDLTs.dlts.hyperledger_fabric.buildTransaction(fabricTx);
    let unsignedTxObject = {dlt: DltNameOptions.HYPERLEDGER_FABRIC, txObject: formattedFabricTx};

    // Send the transactions to Overledger.
    const txResult = (await overledgerPermissionedDLTs.sendUnsigned([unsignedTxObject])).data;
    if (txResult.success === false){
      throw "error adding transaction to Hyperledger Fabric";
    }
    console.log("");
    console.log('Your ' + DltNameOptions.HYPERLEDGER_FABRIC + ' smart contract invocation transaction hash is: ' + txResult.transactionId);
    console.log("");
    sleep(5000);


    // (STEP 4) check HLF asset transfer occurred correctly by querying current state (asset balances)
    //sender
    const senderBalance2Object = await overledgerPermissionedDLTs.search.smartContractQuery(DltNameOptions.HYPERLEDGER_FABRIC, hyperledgerFabricSmartContractSenderBalanceQuery.response);
    const senderBalance2 = senderBalance2Object.data.payload.response.balance;
    console.log(`\nBalance of: ` + fabricSenderAddress + ` = `+ senderBalance2.toString());
    //receiver    
    const receiverBalance2Object = await overledgerPermissionedDLTs.search.smartContractQuery(DltNameOptions.HYPERLEDGER_FABRIC, hyperledgerFabricSmartContractReceiverBalanceQuery.response);
    const receiverBalance2 = receiverBalance2Object.data.payload.response.balance;
    console.log(`\nBalance of: ` + fabricReceiverAddress + ` = `+ receiverBalance2.toString());
    if (!(senderBalance2 === senderBalance1 - fabricValueToSend)){
      throw "Balance not correctly changed for the sender";
    } else if (!(receiverBalance2 === receiverBalance1 + fabricValueToSend)) {
      throw "Balance not correctly changed for the receiver";   
    } else {
      console.log(`\nBalance updated correctly`);
    }
    sleep(5000);
    
    const transactionMessage = "OVL HLF Tx: " + txResult.transactionId;

    // SET partyA accounts for signing;
    overledgerPublicDLTs.dlts.ethereum.setAccount({privateKey: partyAEthereumPrivateKey});
    overledgerPublicDLTs.dlts.ripple.setAccount({privateKey: partyAxrpPrivateKey});
    
    // Get the address sequences.
    const ethereumSequenceRequest = await overledgerPublicDLTs.dlts.ethereum.getSequence(partyAEthereumAddress);
    const xrpSequenceRequest = await overledgerPublicDLTs.dlts.ripple.getSequence(partyAxrpAddress);
    const ethereumAccountSequence = ethereumSequenceRequest.data.dltData[0].sequence;
    const xrpAccountSequence = xrpSequenceRequest.data.dltData[0].sequence;

    // Sign the transactions.
    // As input to this function, we will be providing:
    //  (1) a TransactionBitcoinRequest object (of @quantnetwork/overledger-dlt-bitcoin) that inherits from the TransactionUtxoRequest object which inherits from the TransactionRequest object (both of @quantnetwork/overledger-types)
    //  (2) a TransactionEthereumRequest object (of @quantnetwork/overledger-dlt-ethereum) that inherits from the TransactionAccountRequest object which inherits from the TransactionRequest object (both of @quantnetwork/overledger-types)
    //  (3) a TransactionXRPRequest object (of @quantnetwork/overledger-dlt-ripple) that inherits from the TransactionAccountRequest object which inherits from the TransactionRequest object (both of @quantnetwork/overledger-types)
    const signedTransactions = await overledgerPublicDLTs.sign([
    {
            // The following parameters are from the TransactionRequest object:
      dlt: DltNameOptions.ETHEREUM,
      type: TransactionTypeOptions.ACCOUNTS,
      subType: {name: TransactionEthereumSubTypeOptions.VALUE_TRANSFER},
      message: transactionMessage,
            // The following parameters are from the TransactionAccountRequest object:
      fromAddress: partyAEthereumAddress,
      toAddress: partyBEthereumAddress,
      sequence: ethereumAccountSequence, // Sequence starts at 0 for newly created addresses
      amount: '0', // On Ethereum you can send 0 amount transactions. But you still pay network fees
      extraFields: {
              // The following parameters are from the TransactionEthereumRequest object:
        compUnitPrice: '8000000000', // Price for each individual gas unit this transaction will consume
        compLimit: '80000', // The maximum fee that this transaction will use
      },
    },
    {
            // The following parameters are from the TransactionRequest object:
      dlt: DltNameOptions.XRP_LEDGER,
      type: TransactionTypeOptions.ACCOUNTS,
      subType: { name: TransactionXRPSubTypeOptions.VALUE_TRANSFER },
      message: transactionMessage,
            // The following parameters are from the TransactionAccountRequest object:
      fromAddress: partyAxrpAddress,
      toAddress: partyBxrpAddress,
      sequence: xrpAccountSequence, // Sequence starts at 0 for newly created addresses
      amount: '1', // Minimum allowed amount of drops is 1.      
      extraFields: {
                      // The following parameters are from the TransactionXRPRequest object:
        feePrice: '12', // Minimum feePrice on XRP Ledger is 12 drops.
        maxLedgerVersion: '4294967295', // The maximum ledger version the transaction can be included in.
      },
    },]);

    //console.log("Signed transactions: ");
    //console.log(JSON.stringify(signedTransactions, null, 2));

    // Send the transactions to Overledger.
    const result = (await overledgerPublicDLTs.send(signedTransactions)).data;

    // Log the result.
    //console.log('OVL result:');
    //console.log(JSON.stringify(result, null, 2));
    //console.log("");
    counter = 0;
    while (counter < result.dltData.length){
      console.log('Your ' + result.dltData[counter].dlt + ' public audit transaction hash is: ' + result.dltData[counter].transactionHash);
      console.log("");
      counter = counter + 1;
    }
  } catch (e) {
    console.error('error:', e);
  }
})();

function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}
