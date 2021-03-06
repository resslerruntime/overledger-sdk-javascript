//NOTE: replace @quantnetwork/ with ../../packages/ for all require statements below if you have not built the SDK yourself
const OverledgerSDK = require('@quantnetwork/packages/overledger-bundle/dist').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const SCFunctionTypeOptions = require('@quantnetwork/overledger-types').SCFunctionTypeOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;
const TransactionHyperledgerFabricSubTypeOptions = require('@quantnetwork/packages/overledger-dlt-hyperledger_fabric/dist').TransactionHyperledgerFabricSubTypeOptions;
const HyperledgerFabricTypeOptions = require('@quantnetwork/packages/overledger-dlt-hyperledger_fabric/dist').HyperledgerFabricTypeOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = '';
const bpiKey = '';

//cross chain parameters
const MultichainSender = "";
const MultichainReceiver = "";
const MultichainAmount = 0;

//corda parameters
const cordapp = ""; 
const initiateFlow = "";
const completionFlow = "";
const cordaSender = MultichainSender;
const cordaReceiver = MultichainReceiver;
const CordaAmount = MultichainAmount.toString();
const currency = "";
const cordaNetworkConnection = "";


//hyperledger fabric parameters
const fabricMSP = '';
const fabricSmartContract = '';
const fabricAdmin = '';
const fabricSender = MultichainSender;
const fabricReceiver = MultichainReceiver;
const fabricValueToSend = MultichainAmount;
const fabricNetworkConnection = '';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
  try {

    // (STEP 1) Setup connection to overledger and choose which distributed ledgers to use:
    const overledgerCordaConnection = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: DltNameOptions.CORDA }],
      provider: { network: cordaNetworkConnection },
    });
    const overledgerHLFConnection = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: DltNameOptions.HYPERLEDGER_FABRIC }],
      provider: { network: fabricNetworkConnection },
    });

   overledgerHLFConnection.dlts.hyperledger_fabric.setAccount({address: fabricAdmin, provider: fabricMSP});
   overledgerCordaConnection.dlts.corda.setAccount({provider: MultichainSender});


    // (STEP 2) create Corda obligation for sender to pay receiver at a future date

    let cordaInitiateFlowInfo = {
      cordappName: cordapp,
      flowName: initiateFlow,
      params: [{name: "NODE", value: cordaSender}, 
      {name: "PARTY", value: cordaReceiver},
      {name: "ANONYMOUS", value: false},
      {name: "AMOUNT", value: CordaAmount},
      {name: "TOKEN", value: currency},
      {name: "TOKEN_TYPE", value: "java.util.Currency"},
      ],
    }

  const CordaWorkflowInitiate = overledgerCordaConnection.dlts.corda.buildWorkflow(cordaInitiateFlowInfo);

  if (CordaWorkflowInitiate.success == false){
    throw new Error(`Corda workflow 1 build unsuccessful: ` + CordaWorkflowInitiate.response);      
  }
  const CordaResourceRequest1 = {
    dlt: DltNameOptions.CORDA,
    endpoint: "/transactions/",
    resourceObject: CordaWorkflowInitiate,
  };

    // Send the workflow invocation to Overledger.
    const workflowResult1 = (await overledgerCordaConnection.callNodeResource(CordaResourceRequest1)).data;
    if (workflowResult1.status.status !== "confirmed"){
      throw "error adding invoking Corda workflow: " + JSON.stringify(workflowResult1);
    }
    let tx1Hash = workflowResult1.detailId;
    console.log("");
    console.log('Your ' + DltNameOptions.CORDA + ' issueObligation workflow invocation transaction hash is:\n' + tx1Hash + '\n');
    sleep(7500);

    // (STEP 2b): show Corda current state
      //query transaction
      let cordaTxQueryInfo = overledgerCordaConnection.dlts.corda.getTransactionQueryInfo(tx1Hash);
      let cordaTxQuery = await overledgerCordaConnection.search.getTransaction(tx1Hash, DltNameOptions.CORDA, cordaTxQueryInfo);
      if (typeof cordaTxQuery === 'undefined'){
          throw 'cordaTxQuery undefined';
      }
      //display selected new unspent output information
      console.log("Newly created tx's output:");
      console.log("Borrower: " + cordaTxQuery.data.wire.outputs[0].data.borrower);
      console.log("Lender: " + cordaTxQuery.data.wire.outputs[0].data.lender);
      console.log("Amount: " + cordaTxQuery.data.wire.outputs[0].data.amount);
    sleep(7500);

    // (STEP 3) pay via HLF

      // (STEP 3a) prepare for HLF asset transfer by querying current state (asset balances)

      let fabricSmartContractSenderBalanceQuery = {
        // The following parameters are from the SmartContract object:
      id: fabricSmartContract,
      code: "", // No need to put code here if you are declaring the function call ->
      functionCall: [{
        functionType: SCFunctionTypeOptions.FUNCTION_CALL_WITH_NO_PARAMETERS,
        functionName: "balanceOf", // Not needed for constructor
        inputParams: [
          {  
            type: { selectedType: HyperledgerFabricTypeOptions.STRING }, // First parameter is a boolean array
            name: 'user', // Name of parameter
            value: fabricSender, // Value of the boolean array
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
    id: fabricSmartContract,
    code: "", // No need to put code here if you are declaring the function call ->
    functionCall: [{
    functionType: SCFunctionTypeOptions.FUNCTION_CALL_WITH_NO_PARAMETERS,
    functionName: "balanceOf", // Not needed for constructor
    inputParams: [
      {  
        type: { selectedType: HyperledgerFabricTypeOptions.STRING }, // First parameter is a boolean array
        name: 'user', // Name of parameter
        value: fabricReceiver, // Value of the boolean array
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

    const hyperledgerFabricSmartContractSenderBalanceQuery = overledgerHLFConnection.dlts.hyperledger_fabric.buildSmartContractQuery(fabricAdmin,fabricSmartContractSenderBalanceQuery);
    const hyperledgerFabricSmartContractReceiverBalanceQuery = overledgerHLFConnection.dlts.hyperledger_fabric.buildSmartContractQuery(fabricAdmin,fabricSmartContractReceiverBalanceQuery);

    if (hyperledgerFabricSmartContractSenderBalanceQuery.success == false){
    throw new Error(`Hyperledger Fabric smart contract query 1 build unsuccessful: ` + hyperledgerFabricSmartContractSenderBalanceQuery.response);      
    } else if (hyperledgerFabricSmartContractReceiverBalanceQuery.success == false){
    throw new Error(`Hyperledger Fabric smart contract query 2 build unsuccessful: ` + hyperledgerFabricSmartContractReceiverBalanceQuery.response);      
    }
    //get the current balances:
    console.log("\n\nCurrent HLF balances:");
    //sender
    const senderBalanceObject = await overledgerHLFConnection.search.smartContractQuery(DltNameOptions.HYPERLEDGER_FABRIC, hyperledgerFabricSmartContractSenderBalanceQuery.response);
    const senderBalance1 = senderBalanceObject.data.payload.response.balance;
    console.log(`Balance of: ` + fabricSender + ` = `+ senderBalance1.toString());
    //receiver    
    const receiverBalanceObject = await overledgerHLFConnection.search.smartContractQuery(DltNameOptions.HYPERLEDGER_FABRIC, hyperledgerFabricSmartContractReceiverBalanceQuery.response);
    const receiverBalance1 = receiverBalanceObject.data.payload.response.balance;
    console.log(`Balance of: ` + fabricReceiver + ` = `+ receiverBalance1.toString());
    sleep(7500);

    // (STEP 3b) Perform asset transfer by adding a tx onto HLF
      //build hlf asset transfer tx as standard object
      let fabricTx = 
      {
            // The following parameters are from the TransactionRequest object:
        dlt: DltNameOptions.HYPERLEDGER_FABRIC,
        type: TransactionTypeOptions.ACCOUNTS,
        subType: { name: TransactionHyperledgerFabricSubTypeOptions.SMART_CONTRACT_INVOCATION },
        message: "",  // This must be empty for a contractInvocation transaction
            // The following parameters are from the TransactionAccountRequest object:
        fromAddress: fabricAdmin,
        toAddress: fabricSmartContract, 
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
                value: fabricSender, // Value 
              },
              {  
                type: { selectedType: HyperledgerFabricTypeOptions.STRING }, // First parameter is a boolean array
                name: 'receiver', // Name of parameter
                value: fabricReceiver, // Value 
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
      let validation = overledgerHLFConnection.dlts.hyperledger_fabric._transactionValidation(fabricTx);
      if (validation.success === false){
        throw "Validation error field: " + validation.failingField +"\nValidation error reason: " + validation.error;
      }
      //build hlf specific transaction
      let formattedFabricTx = overledgerHLFConnection.dlts.hyperledger_fabric.buildTransaction(fabricTx);
      let unsignedTxObject = {dlt: DltNameOptions.HYPERLEDGER_FABRIC, txObject: formattedFabricTx};
  
      // Send the transactions to Overledger.
      const txResult = (await overledgerHLFConnection.sendUnsigned([unsignedTxObject])).data;
      if (txResult.success === false){
        throw "error adding transaction to Hyperledger Fabric";
      }
      console.log("");
      console.log('Your ' + DltNameOptions.HYPERLEDGER_FABRIC + ' smart contract invocation transaction hash is: ' + txResult.transactionId);
      console.log("");
      sleep(7500);
  
  
      // (STEP 3c) check HLF asset transfer occurred correctly by querying current state (asset balances)
      console.log("\nNew HLF balances:");      
      //sender
      const senderBalance2Object = await overledgerHLFConnection.search.smartContractQuery(DltNameOptions.HYPERLEDGER_FABRIC, hyperledgerFabricSmartContractSenderBalanceQuery.response);
      const senderBalance2 = senderBalance2Object.data.payload.response.balance;
      console.log(`Balance of: ` + fabricSender + ` = `+ senderBalance2.toString());
      //receiver    
      const receiverBalance2Object = await overledgerHLFConnection.search.smartContractQuery(DltNameOptions.HYPERLEDGER_FABRIC, hyperledgerFabricSmartContractReceiverBalanceQuery.response);
      const receiverBalance2 = receiverBalance2Object.data.payload.response.balance;
      console.log(`Balance of: ` + fabricReceiver + ` = `+ receiverBalance2.toString());
      if (!(senderBalance2 === senderBalance1 - fabricValueToSend)){
        throw "Balance not correctly changed for the sender";
      } else if (!(receiverBalance2 === receiverBalance1 + fabricValueToSend)) {
        throw "Balance not correctly changed for the receiver";   
      } else {
        console.log(`\nBalances updated correctly!`);
      }
      sleep(7500);
      

    // (STEP 4) settle Corda obligation side
    let cordaCompletionFlowInfo = {
      cordappName: cordapp,
      flowName: completionFlow,
      params: [ 
      {name: "ANONYMOUS", value: true},
      {name: "AMOUNT", value: CordaAmount},
      {name: "NODE", value: cordaSender},
      {name: "TOKEN_TYPE", value: "java.util.Currency"},
      {name: "ID", value: workflowResult1.details.wire.outputs[0].data.linearId.id},
      {name: "TOKEN", value: currency},
      ],
    };
    const CordaWorkflowCompletion = overledgerCordaConnection.dlts.corda.buildWorkflow(cordaCompletionFlowInfo);

    if (CordaWorkflowCompletion.success == false){
      throw new Error(`Corda workflow 2 build unsuccessful: ` + CordaWorkflowCompletion.response);      
    }
    const CordaResourceRequest2 = {
      dlt: DltNameOptions.CORDA,
      endpoint: "/transactions/",
      resourceObject: CordaWorkflowCompletion,
    };
    // Send the workflow invocation to Overledger.
    const workflowResult2 = (await overledgerCordaConnection.callNodeResource(CordaResourceRequest2)).data;
    if (workflowResult2.status.status !== "confirmed"){
      throw "error adding invoking Corda workflow: " + JSON.stringify(workflowResult2);
    }
    console.log("");
    console.log('\nYour ' + DltNameOptions.CORDA + ' settleObligation workflow invocation transaction hash is:\n ' + workflowResult2.detailId);
    console.log("");

    // (STEP 4b): show Corda current state
      //query transaction
      let cordaTx2QueryInfo = overledgerCordaConnection.dlts.corda.getTransactionQueryInfo(workflowResult2.detailId);
      let cordaTx2Query = await overledgerCordaConnection.search.getTransaction(workflowResult2.detailId, DltNameOptions.CORDA, cordaTx2QueryInfo);
      if (typeof cordaTx2Query === 'undefined'){
          throw 'cordaTx2Query undefined';
      }
      //display selected new spent input information
      //show that the original unspent obligation is now spent as an input in the new transaction
      console.log("Newly created tx's input:");
      let tx2InputHash = cordaTx2Query.data.wire.inputs[0].txhash
      console.log("Tx input hash: " + tx2InputHash);
      if (tx2InputHash !== tx1Hash){
        throw "Tx1Hash and tx2InputHash do NOT match";
      } else {
        console.log("\nTx1Hash and tx2InputHash match, therefore obligation is spent!\n");
      }
    
  } catch (e) {
    console.error('error:', e);
  }
})();

function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}
