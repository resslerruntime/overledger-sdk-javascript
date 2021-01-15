const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const SCFunctionTypeOptions = require('@quantnetwork/overledger-types').SCFunctionTypeOptions;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const TransactionEthereumSubTypeOptions = require('@quantnetwork/overledger-dlt-ethereum').TransactionEthereumSubTypeOptions;
const EthereumTypeOptions = require('@quantnetwork/overledger-dlt-ethereum').EthereumTypeOptions;
const EthereumUintIntOptions = require('@quantnetwork/overledger-dlt-ethereum').EthereumUintIntOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;
const TransactionXRPSubTypeOptions = require('@quantnetwork/overledger-dlt-ripple').TransactionXRPSubTypeOptions;
const functionsNames = require('./data').functionsNames;
const util = require('util');
const fs = require('fs');
const sha256 = require('crypto-js/sha256');
const readFile = util.promisify(fs.readFile);
const DEFAULT_OFFSET = 0;
const DEFAULT_LENGTH = 25;

function validateConstructorInitParameters(initObject) {
  if (!initObject.dltKey) {
    return false;
  }
  return true;
}

function validateInitiateNewRequestParameters(initiateNewRequestObject) {
  if (!initiateNewRequestObject.dltKey) {
    return false;
  }
  if (!initiateNewRequestObject.receiver) {
    return false;
  }
  if (!initiateNewRequestObject.amount) {
    return false;
  }
  return true;
}


function validateFinaliseRequestParameters(finaliseRequestObject) {
  if (!finaliseRequestObject.dltKey) {
    return false;
  }
  if (! (typeof finaliseRequestObject.requestId === 'number')) {
    return false;
  }
  if (!finaliseRequestObject.xrpHash) {
    return false;
  }
  return true;
}

function validateXRPTransactionParameters(sendXrpObject) {
  if (!sendXrpObject.dltKey) {
    return false;
  }
  if (!sendXrpObject.destination) {
    return false;
  }
  if (!sendXrpObject.amount) {
    return false;
  }
  return true;

}

/**
 * instantiates an overledger instance for the given DLTs
 * @param {*} overledgerMappId 
 * @param {*} OverledgerBpiKey 
 * @param {*} overledgerDLTs - String list of DLTs to connect to
 * @param {*} overledgerNetwork - String of "testnet" or "mainnet"
 */
async function instantiateOverledgerInstance(overledgerMappId, OverledgerBpiKey, overledgerDLTs, overledgerNetwork) {
  // console.log("***instaniateOverledgerInstance***");
  if (Array.isArray(overledgerDLTs)) {
    let count = 0;
    let dltsForRequest = [];
    while (count < overledgerDLTs.length) {
      dltsForRequest[count] = { dlt: overledgerDLTs[count] };
      count++;
    }
    // console.log("network is: + " + overledgerNetwork);
    let overledger = new OverledgerSDK(overledgerMappId, OverledgerBpiKey, { dlts: dltsForRequest, provider: { network: overledgerNetwork } });
    // console.log(`instantiateOverledgerInstance overledger ${overledger}`);
    return overledger;
  } else {
    return null;
  }
}

/**
 * Adds a dlt account via its private key
 * @param {*} overledgerSDK 
 * @param {*} overledgerDLTs 
 * @param {*} overledgerPrivateKeys 
 */
async function addAccountsToOverledger(overledgerSDK, overledgerDLTs, overledgerPrivateKeys) {
  console.log(overledgerSDK);
  console.log(`overledgerDLTs ${JSON.stringify(overledgerDLTs)}, overledgerPrivateKeys ${JSON.stringify(overledgerPrivateKeys)} `);
  if (Array.isArray(overledgerDLTs)) {
    let count = 0;
    while (count < overledgerDLTs.length) {
      if (overledgerSDK.dlts[overledgerDLTs[count]] != undefined) {
        const t = overledgerSDK.dlts[overledgerDLTs[count]].setAccount({privateKey: overledgerPrivateKeys[count]});
        console.log(`t ${t}`);
      }
      count++;
    }
  }
  return overledgerSDK;
}

/**
 * Allows the smart contract to deploy the smart contract infrastructure
 * @param {*} constructorParams - the parameters for this deployment
 */
async function startup(overledgerSDK, constructorParams, byteCodeLocation, smartContractByteCodeHash) {
  console.log("********************FUNCTION:startup********************");
  try {
    //search for transaction with the mapp unique ID
    let mappTransactions = await overledgerSDK.readTransactionsByMappId();
    console.log(`mappTransactions ${mappTransactions}`);
    //Only allow the deployment of smart contract infrastructure if there has been no transactions deployed for this treaty contract or redeploy is set **REMOVE THIS FOR FINAL VERSION**
    if ((mappTransactions.data.totalTransactions == 0) || (constructorParams.redeploy == true)) {
      //if the MAPP/BPIKey combination has not yet been used deploy TX1: Solidity atomic swap smart contract by:
      //(a) loading the byte code
      let SolidityByteCode = await loadDataFromFile(byteCodeLocation);
      SolidityByteCode = "0x" + SolidityByteCode;
      //(b) checking this byte code matches the given hash
      let solidityHash = sha256(SolidityByteCode).toString();
      console.log("SolidityByteCodeHash: " + solidityHash);
      if (solidityHash == smartContractByteCodeHash.toString()) {
        //(c) if it does then deploy the contract (else return an error message)
        let smartContractCreationOptions = await generateSmartContractCreationOptions(overledgerSDK, constructorParams, SolidityByteCode, smartContractByteCodeHash);
        console.log(`smartContractCreationOptions ${smartContractCreationOptions}`);
        let contractCreationTx = buildDLTransaction(overledgerSDK, DltNameOptions.ETHEREUM, "", TransactionEthereumSubTypeOptions.SMART_CONTRACT_DEPLOY, "", smartContractCreationOptions);
        console.log(`contractCreationTx ${JSON.stringify(contractCreationTx)}`);
        let signedContractCreationTx = await signDLTransactions(overledgerSDK, [contractCreationTx]);
        const result = (await overledgerSDK.send(signedContractCreationTx)).data;
        const transactionHash = result.dltData[0].transactionHash;
        console.log(`===== result `, result);
        console.log(JSON.stringify(result, null, 2));
        let toReturn = {
          result: transactionHash,
          event: "newContract"
        }
        return toReturn;
      } else {
        console.log("The loaded Solidity byte code is not the same as the expected version");
        console.log("Loaded Solidity byte code hash: " + solidityHash);
        console.log("Expected Solidity byte code hash: " + smartContractByteCodeHash);
        let toReturn = {
          result: "The loaded Solidity byte code is not the same as the expected version",
          event: "SolidityHashFail"
        }
        return toReturn;
      }

    } else {
      console.log("Treaty Contract MAPP has already been created!");
      console.log("Number of MAPP transactions: " + mappTransactions.data.totalTransactions);
      //or return "already deployed: " and return TX1's receipt or info 
      let smartContractAddress = await getContractAddress(overledgerSDK, constructorParams.dltKey, smartContractByteCodeHash);
      console.log(`smart contract already deployed ${smartContractAddress}`);
      let toReturn = {
        result: smartContractAddress,
        event: "ContractAlreadyDeployed"
      }
      return toReturn;
    }
  } catch (e) {
    console.error('error', e);
  }
}

/**
 * allows any party to check if a tx has been confirmed 
 * @param {*} readOrderParameters 
 */
async function checkForTransactionConfirmation(overledgerSDK, transactionHash, retry, maxRetry) {
  sleep(3000);
  let confirmationResp;
  let txParams = await overledgerSDK.search.getTransaction(transactionHash.toString());
  if (txParams.data.dlt && txParams.data.dlt.toUpperCase() === DltNameOptions.ETHEREUM.toUpperCase()) {
    confirmationResp = txParams.data.data.blockNumber;
    if (parseInt(confirmationResp, 10) > 0) {
      console.log(`ethereum transaction ${transactionHash} confirmed`);
      return true;
    }
  } else if (txParams.data.dlt && txParams.data.dlt.toUpperCase() === DltNameOptions.XRP_LEDGER.toUpperCase()) {
    confirmationResp = txParams.data.data.outcome.result;
    if (confirmationResp === "tesSUCCESS") {
      console.log(`ripple transaction ${transactionHash} confirmed`);
      return true;
    }
  }
  if (retry < maxRetry) {
    return checkForTransactionConfirmation(overledgerSDK, transactionHash, retry + 1, maxRetry)
  }
  return false;
}
 
async function initiateNewRequest(overledgerSDK, dltKey, contractAddress, receiverAddress, ethAmount, feePrice, feeLimit) {
  console.log(`-------- INITIATE NEW REQUEST`);
  let sequenceNumResponse = await overledgerSDK.dlts.ethereum.getSequence(dltKey.dltAddress);
  let sequenceNum = sequenceNumResponse.data.dltData[0].sequence;
  const functionParameters = [
    {
      type: { selectedType: EthereumTypeOptions.ADDRESS },
      name: 'addressReceiver',
      value: receiverAddress.toString()
    }
  ];

  let options = {
    amount: ethAmount.toString(),
    sequence: sequenceNum,
    fromAddress: dltKey.dltAddress,
    extraFields: {
      compUnitPrice: feePrice,
      compLimit: feeLimit
    },
    smartContract: {
      functionCall: [{
        functionType: SCFunctionTypeOptions.FUNCTION_CALL_WITH_PARAMETERS,
        functionName: 'initiateRequest',
        inputParams: functionParameters
      }],
      extraFields: {
        payable: true
      }
    }
  }

  let contractInvocationTx = buildDLTransaction(overledgerSDK, DltNameOptions.ETHEREUM, contractAddress, TransactionEthereumSubTypeOptions.SMART_CONTRACT_INVOCATION, "", options);
  console.log(`contractInvocationTx ${JSON.stringify(contractInvocationTx)}`);
  let signedContractInvocationTx = await signDLTransactions(overledgerSDK, [contractInvocationTx]);
  const result = (await overledgerSDK.send(signedContractInvocationTx)).data;
  console.log(`result ${JSON.stringify(result)}`);
  const transactionHash = result.dltData[0].transactionHash;
  return transactionHash;



}

async function finaliseRequest(overledgerSDK, dltKey, contractAddress, requestId, xrpTransactionhash, feePrice, feeLimit) {
  let sequenceNumResponse = await overledgerSDK.dlts.ethereum.getSequence(dltKey.dltAddress);
  let sequenceNum = sequenceNumResponse.data.dltData[0].sequence;
  const functionParameters = [
    {
      type: { selectedType: EthereumTypeOptions.UINT_B, selectedIntegerLength: EthereumUintIntOptions.B256 },
      name: 'requestID',
      value: requestId.toString()
    },
    {
      type: { selectedType: EthereumTypeOptions.STRING },
      name: 'thisXrpTransactionHash',
      value: xrpTransactionhash.toString()
    }
  ];

  let options = {
    amount: '0',
    sequence: sequenceNum,
    fromAddress: dltKey.dltAddress,
    extraFields: {
      compUnitPrice: feePrice,
      compLimit: feeLimit
    },
    smartContract: {
      functionCall: [{
        functionType: SCFunctionTypeOptions.FUNCTION_CALL_WITH_PARAMETERS,
        functionName: 'finaliseRequest',
        inputParams: functionParameters
      }],
      extraFields: {
        payable: false
      }
    }
  }

  let contractInvocationTx = buildDLTransaction(overledgerSDK, DltNameOptions.ETHEREUM, contractAddress, TransactionEthereumSubTypeOptions.SMART_CONTRACT_INVOCATION, "", options);
  console.log(`contractInvocationTx ${JSON.stringify(contractInvocationTx)}`);
  let signedContractInvocationTx = await signDLTransactions(overledgerSDK, [contractInvocationTx]);
  const result = (await overledgerSDK.send(signedContractInvocationTx)).data;
  console.log(`result ${JSON.stringify(result)}`);
  const transactionHash = result.dltData[0].transactionHash;
  return transactionHash;

}

async function sendXRPTransaction(overledgerSDK, dltKey, destination, amount) {
  let sequenceNumResponse = await overledgerSDK.dlts.ripple.getSequence(dltKey.dltAddress);
  let sequenceNum = sequenceNumResponse.data.dltData[0].sequence;
  const options = {
    fromAddress: dltKey.dltAddress,
    sequence: sequenceNum,
    amount,
    extraFields: {
      feePrice: '12',
      maxLedgerVersion: '4294967295',
    },
  }

  let xrpTransaction = buildDLTransaction(overledgerSDK, DltNameOptions.XRP_LEDGER, destination, TransactionXRPSubTypeOptions.VALUE_TRANSFER, "XRP treaty contract example", options);
  console.log(`xrpTransaction ${JSON.stringify(xrpTransaction)}`);
  let signedTransaction = await signDLTransactions(overledgerSDK, [xrpTransaction]);
  const result = (await overledgerSDK.send(signedTransaction)).data;
  console.log(`result ${JSON.stringify(result)}`);
  const transactionHash = result.dltData[0].transactionHash;
  return transactionHash;
}

async function loadDataFromFile(fileLocation) {
  const content = await readFile(fileLocation, 'utf8');
  return content;
}

async function generateSmartContractCreationOptions(overledgerSDK, params, smartContractByteCode, smartContractByteCodeHash) {
  console.log(`params ${JSON.stringify(params)}`);
  const functionType = SCFunctionTypeOptions.CONSTRUCTOR_WITH_PARAMETERS;
  console.log(`functionType ${functionType}`);
  let sequenceNumResponse = await overledgerSDK.dlts.ethereum.getSequence(params.dltKey.dltAddress);
  let sequenceNum = sequenceNumResponse.data.dltData[0].sequence;

  let options = {
    amount: '0',
    sequence: sequenceNum,
    fromAddress: params.dltKey.dltAddress,
    extraFields: {
      compUnitPrice: params.feePrice,
      compLimit: params.feeLimit
    },
    smartContract: {
      code: smartContractByteCode,
      functionCall: [{
        functionType,
        functionName: "",
        inputParams: [
          {
          type: { selectedType: EthereumTypeOptions.STRING },
          name: "contractByteCodeHash",
          value: "0x" + smartContractByteCodeHash
          }
        ]
      }],
      extraFields: {
        payable: false
      }
    }
  }
  return options;
}

function buildDLTransaction(overledgerSDK, overledgerDLT, toAddressOnDL, subTypeForDL, messageForDL, optionsForDL) {

  let transaction = null;
  if (overledgerSDK.dlts[overledgerDLT] != undefined) {
    try {
      transaction = {
        dlt: overledgerDLT,
        type: TransactionTypeOptions.ACCOUNTS,
        subType: { name: subTypeForDL },
        message: messageForDL,
        toAddress: toAddressOnDL, ...optionsForDL
      };
      console.log(`transaction ${JSON.stringify(transaction)}`);
    } catch (err) {
      console.log("Error when building transaction for " + overledgerDLT + ": " + err);
    }
  }
  return transaction;

}

async function signDLTransactions(overledgerSDK, transactions) {

  let signedTransactions = null;
  if (Array.isArray(transactions) && (overledgerSDK != undefined)) {
    try {
      signedTransactions = await overledgerSDK.sign(transactions);
      console.log("after sign");
    } catch (err) {
      console.log("Error when signing transaction for: " + err);
    }
  }
  return signedTransactions;

}

async function readParamValue(overledger, dltKey, functionName, smartContractAddress) {
  const input = {
    fromAddress: dltKey.dltAddress,
    contractAddress: smartContractAddress,
    funcName: functionName,
    inputValues: [],
    outputTypes: [
      functionsNames[functionName]
    ]
  }
  console.log(`before readContract input ${JSON.stringify(input)}`);
  const res = await readContract(overledger, dltKey.dltName, input);
  console.log(`res ${res}`);
  return { fname: functionName, result: res.data.results };
}

async function readContract(overledger, dlt, input) {
  return await overledger.search.smartContractQuery(dlt, input);
}

async function getSmartContract(overledger, dltKey, byteCodeContractHash, offset, length) {
  // see the case where the number of transactions is big ( search by chunks ?)
  let latestCreationMapp;
  const response = await overledger.readTransactionsByMappId(offset, length);
  let creationDetails;
  if (response) {
      const transactions = response.data;
      const txns = transactions.transactions;
      if (txns && txns.length > 0) {
          const sortedTxns = txns.filter(t => t.dltData.filter(d => d.dlt === DltNameOptions.ETHEREUM)).sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
          for (let txn of sortedTxns) {
              const dltData = txn.dltData;
              const dltDataEth = dltData.filter(d => d.dlt === DltNameOptions.ETHEREUM);
              for (let data of dltDataEth) {
                  const txnHash = data.transactionHash;
                  const error = data.status.status;
                  if (txnHash && error !== 'error') {
                      let txnDetails;
                      try {
                          txnDetails = await overledger.search.getTransaction(txnHash);
                      } catch (e) {
                          continue;
                      }
                      const data = txnDetails.data;
                      if (data && data.data) {
                          const txnInfos = data.data;
                          if (txnInfos.creates !== '' && txnInfos.to === null) {
                              const contractIdentifierParams = { dltKey, paramName: "contractIdentifier" };
                              console.log(`contractIdentifierParams ${contractIdentifierParams}`);
                              const resp = await readParamValue(overledger, contractIdentifierParams.dltKey, contractIdentifierParams.paramName, txnInfos.creates);
                              console.log(`resp ${JSON.stringify(resp)}`);
                              const contractIdentifier = resp.result[0];
                              console.log(`contractIdentifier ${contractIdentifier}`);
                              if (contractIdentifier === "0x" + byteCodeContractHash) {
                                  latestCreationMapp = txn;
                                  creationDetails = { txnHash, createdContract: txnInfos.creates, timestamp: txn.timestamp };
                                  return { latestCreationMapp, creationDetails };
                              }
                          }
                      }
                  }
              }
          }
          console.log(`latest Creation ${JSON.stringify(latestCreationMapp)}`);
      } else {
          return [];
      }
      const initOffset = offset ? offset : DEFAULT_OFFSET;
      const initLength = length ? length : DEFAULT_LENGTH;
      return getSmartContract(overledger, initOffset + initLength + 1, initLength);
  } else {
      throw new Error('Failing to read the mappId data');
  }
}

async function getContractAddress(overledger, dltKey, byteCodeContract, offset, length) {
  const resp = await getSmartContract(overledger, dltKey, byteCodeContract, offset, length);
  let contractAddress;
  if(resp){
      contractAddress = resp.creationDetails.createdContract;
  }
  return contractAddress;
}


/**
 * Sleeps for a number of miliseconds
 * @param {*} ms - the number of miliseconds
 */
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.validateConstructorInitParameters = validateConstructorInitParameters;
exports.instantiateOverledgerInstance = instantiateOverledgerInstance;
exports.addAccountsToOverledger = addAccountsToOverledger;
exports.startup = startup;
exports.checkForTransactionConfirmation = checkForTransactionConfirmation;
exports.validateInitiateNewRequestParameters = validateInitiateNewRequestParameters;
exports.initiateNewRequest = initiateNewRequest;
exports.validateFinaliseRequestParameters = validateFinaliseRequestParameters;
exports.finaliseRequest = finaliseRequest;
exports.readParamValue = readParamValue;
exports.sendXRPTransaction = sendXRPTransaction;
exports.validateXRPTransactionParameters = validateXRPTransactionParameters;
exports.getContractAddress = getContractAddress;
exports.sleep = sleep;