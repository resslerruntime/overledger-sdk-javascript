//NOTE: replace @quantnetwork/ with ../../packages/ for all require statements below if you have not built the SDK yourself
const OverledgerSDK = require('../../packages/overledger-bundle/dist').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;
const TransactionEthereumSubTypeOptions = require('../../packages/overledger-dlt-ethereum/dist').TransactionEthereumSubTypeOptions;
const TransactionXRPSubTypeOptions = require('../../packages/overledger-dlt-ripple/dist').TransactionXRPSubTypeOptions;

//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappIdTestnet = '';
const bpiKeyTestnet = '';
const mappIdCorda = '';
const bpiKeyCorda = '';

// For Ethereum you can generate an account using `OverledgerSDK.dlts.ethereum.createAccount` then fund the address at the Ropsten Testnet Faucet.
const partyAEthereumPrivateKey = '0xe352ad01a835ec50ba301ed7ffb305555cbf3b635082af140b3864f8e3e443d3'; //should have 0x in front
const partyAEthereumAddress = '0x650A87cfB9165C9F4Ccc7B971D971f50f753e761';

// For the XRP ledger, you can go to the official XRP Testnet Faucet to get an account already funded.
// Keep in mind that for XRP the minimum transfer amount is 20XRP (20,000,000 drops), if the address is not yet funded.
const partyAxrpPrivateKey = 'sswERuW1KWEwMXF6VFpRY72PxfC9b';
const partyAxrpAddress = 'rhTa8RGotyJQAW8sS2tFVVfvcHYXaps9hC';

//corda parameters
const cordapp = '';
const initiateFlow = '';
const completionFlow = '';
const sender = '';
const receiver = '';
const amount = '';
const currency = '';
const cordaNetworkConnection = '';

// Now provide three other addresses that you will be transfering value too
const partyBEthereumAddress = '0xB3ea4D180f31B4000F2fbCC58a085eF2ffD5a763';
const partyBxrpAddress = 'rKoGTTkPefCuQR31UHsfk9jKnrQHz6LtKe';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
  try {

    // (STEP 1) Setup connection to overledger and choose which distributed ledgers to use:
    const overledgerPublicDLTs = new OverledgerSDK(mappIdTestnet, bpiKeyTestnet, {
      dlts: [{ dlt: DltNameOptions.BITCOIN }, { dlt: DltNameOptions.ETHEREUM }, { dlt: DltNameOptions.XRP_LEDGER }],
      provider: { network: 'testnet' },
    });
    const overledgerPermissionedDLTs = new OverledgerSDK(mappIdCorda, bpiKeyCorda, {
      dlts: [{ dlt: DltNameOptions.CORDA }],
      provider: { network: cordaNetworkConnection },
    });



    // (STEP 2) create Corda obligation for sender to pay receiver at a future date

    let cordaInitiateFlowInfo = {
      cordappName: cordapp,
      flowName: initiateFlow,
      params: [{name: "NODE", value: sender}, 
      {name: "PARTY", value: receiver},
      {name: "ANONYMOUS", value: false},
      {name: "AMOUNT", value: amount},
      {name: "TOKEN", value: currency},
      {name: "TOKEN_TYPE", value: "java.util.Currency"},
      ],
    }

  const CordaWorkflowInitiate = overledgerPermissionedDLTs.dlts.corda.buildWorkflow(cordaInitiateFlowInfo);

  if (CordaWorkflowInitiate.success == false){
    throw new Error(`Corda workflow 1 build unsuccessful: ` + CordaWorkflowInitiate.response);      
  }
  const CordaResourceRequest1 = {
    dlt: DltNameOptions.CORDA,
    endpoint: "/transactions/",
    resourceObject: CordaWorkflowInitiate,
  };

    // Send the workflow invocation to Overledger.
    const workflowResult1 = (await overledgerPermissionedDLTs.callNodeResource(CordaResourceRequest1)).data;
    if (workflowResult1.status.status !== "confirmed"){
      throw "error adding invoking Corda workflow: " + JSON.stringify(workflowResult1);
    }
    console.log("");
    console.log('Your ' + DltNameOptions.CORDA + ' workflow invocation transaction hash is: ' + workflowResult1.detailId);
    console.log("");
    sleep(5000);

    // (STEP 3) settle obligation
    let cordaCompletionFlowInfo = {
      cordappName: cordapp,
      flowName: completionFlow,
      params: [ 
      {name: "ANONYMOUS", value: true},
      {name: "AMOUNT", value: amount},
      {name: "NODE", value: sender},
      {name: "TOKEN_TYPE", value: "java.util.Currency"},
      {name: "ID", value: workflowResult1.details.wire.outputs[0].data.linearId.id},
      {name: "TOKEN", value: currency},
      ],
    };
    const CordaWorkflowCompletion = overledgerPermissionedDLTs.dlts.corda.buildWorkflow(cordaCompletionFlowInfo);

    if (CordaWorkflowCompletion.success == false){
      throw new Error(`Corda workflow 2 build unsuccessful: ` + CordaWorkflowCompletion.response);      
    }
    const CordaResourceRequest2 = {
      dlt: DltNameOptions.CORDA,
      endpoint: "/transactions/",
      resourceObject: CordaWorkflowCompletion,
    };
    // Send the workflow invocation to Overledger.
    const workflowResult2 = (await overledgerPermissionedDLTs.callNodeResource(CordaResourceRequest2)).data;
    if (workflowResult2.status.status !== "confirmed"){
      throw "error adding invoking Corda workflow: " + JSON.stringify(workflowResult2);
    }
    console.log("");
    console.log('Your ' + DltNameOptions.CORDA + ' workflow invocation transaction hash is: ' + workflowResult2.detailId);
    console.log("");
    sleep(5000);
    
    const transactionMessage = "Corda issueObligation Tx: " + workflowResult1.detailId + "\nCorda settleObligation Tx: " + workflowResult2.detailId;

    // SET partyA accounts for signing;
    overledgerPublicDLTs.dlts.ethereum.setAccount(partyAEthereumPrivateKey);
    overledgerPublicDLTs.dlts.ripple.setAccount(partyAxrpPrivateKey);
    
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
