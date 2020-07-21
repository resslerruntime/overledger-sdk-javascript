
//general imports
console.log('Starting imports');

//node imports:
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const validateConstructorInitParameters = require('./treaty-contract-functions').validateConstructorInitParameters;
const instantiateOverledgerInstance = require('./treaty-contract-functions').instantiateOverledgerInstance;
const addAccountsToOverledger = require('./treaty-contract-functions').addAccountsToOverledger;
const startup = require('./treaty-contract-functions').startup;
const checkForTransactionConfirmation = require('./treaty-contract-functions').checkForTransactionConfirmation;
const validateInitiateNewRequestParameters = require('./treaty-contract-functions').validateInitiateNewRequestParameters;
const validateFinaliseRequestParameters = require('./treaty-contract-functions').validateFinaliseRequestParameters;
const finaliseRequest = require('./treaty-contract-functions').finaliseRequest;
const initiateNewRequest = require('./treaty-contract-functions').initiateNewRequest;
const readParamValue = require('./treaty-contract-functions').readParamValue;
const validateXRPTransactionParameters = require('./treaty-contract-functions').validateXRPTransactionParameters;
const sendXRPTransaction = require('./treaty-contract-functions').sendXRPTransaction;
const getContractAddress = require('./treaty-contract-functions').getContractAddress;

const overledgerMappId = '...';
const OverledgerBpiKey = '...';
const network = "testnet";

const solidityFileLocation = "./smart-contracts/BasicSwapEthXRP.txt";
const smartContractByteCodeSha256Hash = "dd0e6a0171c16ec5b5390c1e6280d02a667f5b16f965772af99883ac7046ddd8";

//setting app properties:
console.log('Starting basic swap treaty contract demo');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(bodyParser.json())
app.set('view engine', 'ejs');

const port = process.argv[2];

if (port && port > 0) {
    app.listen(port, async function () {
        console.log(`Example app listening on port ${port}!`);
    });
} else {
    console.log(`Port server must be defined: node treaty-contract.js portNumber`);
}

const treatyContractUrl = `http://localhost:${port}`;

app.post('/InitialiseApp', async function (req, res) {
    console.log("********************SERVER:CREATE SMART CONTRACT********************");
    let toReturn;
    try {
        let initParams = req.body;
        console.log(`initParams`, initParams);
        let validationFeedback = validateConstructorInitParameters(initParams);
        console.log(`validationFeedback `, validationFeedback);
        if (validationFeedback) {
            let overledgerSDK = await instantiateOverledgerInstance(overledgerMappId, OverledgerBpiKey, [DltNameOptions.ETHEREUM], network);
            console.log(`overledgerSDK `, overledgerSDK);
            await addAccountsToOverledger(overledgerSDK, [DltNameOptions.ETHEREUM], [initParams.dltKey.dltSecretKey]);
            //deploy migration contract onto ethereum and set the ERC-20 contract address and the Oracle address in the constructor
            let resp = await startup(overledgerSDK, initParams, solidityFileLocation, smartContractByteCodeSha256Hash, network);
            console.info(`resp startup ${JSON.stringify(resp)}`);
            let isInitContractConfirmed;
            if (resp.event === "newContract") {
                isInitContractConfirmed = await checkForTransactionConfirmation(overledgerSDK, resp.result, 0, 1000);

                if (isInitContractConfirmed) {
                    toReturn = {
                        success: true,
                        msg: resp
                    };
                } else {
                    toReturn = {
                        success: false,
                        msg: "Init contract transaction hash not confirmed"
                    };
                }
            } else if (resp.event === "ContractAlreadyDeployed") {
                toReturn = {
                    success: true,
                    msg: resp
                };
            }
        } else {
            toReturn = {
                success: false,
                msg: "paramsNotValid: " + validationFeedback
            }
        }
    } catch (e) {
        console.error('error', e);
        toReturn = {
            success: false,
            msg: 'error:_' + e
        }
    }
    return res.send(toReturn);
});

app.post('/InitiateNewRequest', async function (req, res) {
    console.log("********************INITIATE A NEW REQUEST********************");
    let toReturn;
    let isNewRequest = false;
    let newRequestHash;
    try {
        let newRequestParams = req.body;
        console.log(`newRequestParams ${JSON.stringify(newRequestParams)}`);
        let validationFeedback = validateInitiateNewRequestParameters(newRequestParams); //will return text if there is an error
        console.log(`validationFeedback newRequestParams ${validationFeedback}`);
        if (validationFeedback) {
            let overledgerSDK = await instantiateOverledgerInstance(overledgerMappId, OverledgerBpiKey, [DltNameOptions.ETHEREUM], network);
            await addAccountsToOverledger(overledgerSDK, [DltNameOptions.ETHEREUM], [newRequestParams.dltKey.dltSecretKey]);
            let smartContractAddress = await getContractAddress(overledgerSDK, newRequestParams.dltKey, smartContractByteCodeSha256Hash);
            console.log(`smartContractAddress ${smartContractAddress}`);
            newRequestHash = await initiateNewRequest(overledgerSDK, newRequestParams.dltKey, smartContractAddress, newRequestParams.receiver, newRequestParams.amount, newRequestParams.feePrice, newRequestParams.feeLimit);
            console.log(`initiateNewRequest`, newRequestHash);
            isNewRequest = await checkForTransactionConfirmation(overledgerSDK, newRequestHash, 0, 1000);
            if (isNewRequest) {
                toReturn = {
                    success: true,
                    msg: { transactionHash: newRequestHash }
                };
            } else {
                toReturn = {
                    success: false,
                    msg: "Init new request transaction hash is not confirmed"
                };
            }
        } else {
            toReturn = {
                success: false,
                msg: "Params_Not_Valid: " + validationFeedback
            }
        }
    } catch (e) {
        console.error('error', e);
        toReturn = {
            success: false,
            msg: 'error:_' + e
        }
    }
    return res.send(toReturn);
});

app.post('/SendXRP', async function (req, res) {
    console.log("********************SEND XRP********************");
    let toReturn;
    let isXRPSent = false;
    let xrpTxnHash;
    try {
        let xrpTxnParams = req.body;
        console.log(`xrpTxnParams ${JSON.stringify(xrpTxnParams)}`);
        let validationFeedback = validateXRPTransactionParameters(xrpTxnParams);
        console.log(`validationFeedback xrpTxnParams ${validationFeedback}`);
        if (validationFeedback) {
            let overledgerSDK = await instantiateOverledgerInstance(overledgerMappId, OverledgerBpiKey, [DltNameOptions.XRP_LEDGER], network);
            await addAccountsToOverledger(overledgerSDK, [DltNameOptions.XRP_LEDGER], [xrpTxnParams.dltKey.dltSecretKey]);
            xrpTxnHash = await sendXRPTransaction(overledgerSDK, xrpTxnParams.dltKey, xrpTxnParams.destination, xrpTxnParams.amount);
            console.log(`xrpHash`, xrpTxnHash);
            isXRPSent = await checkForTransactionConfirmation(overledgerSDK, xrpTxnHash, 0, 1000);
            if (isXRPSent) {
                toReturn = {
                    success: true,
                    msg: { transactionHash: xrpTxnHash }
                };
            } else {
                toReturn = {
                    success: false,
                    msg: "send xrp transaction hash is not confirmed"
                };
            }
        } else {
            toReturn = {
                success: false,
                msg: "Params_Not_Valid: " + validationFeedback
            }
        }
    } catch (e) {
        console.error('error', e);
        toReturn = {
            success: false,
            msg: 'error:_' + e
        }
    }
    return res.send(toReturn);
});

app.post('/FinaliseRequest', async function (req, res) {
    console.log("********************FINALISE REQUEST********************");
    let toReturn;
    let isFinalised = false;
    let finaliseHash;
    try {
        let finaliseParams = req.body;
        console.log(`finaliseParams ${JSON.stringify(finaliseParams)}`);
        let validationFeedback = validateFinaliseRequestParameters(finaliseParams); //will return text if there is an error
        console.log(`validationFeedback finaliseParams ${validationFeedback}`);
        if (validationFeedback) {
            let overledgerSDK = await instantiateOverledgerInstance(overledgerMappId, OverledgerBpiKey, [DltNameOptions.ETHEREUM], network);
            await addAccountsToOverledger(overledgerSDK, [DltNameOptions.ETHEREUM], [finaliseParams.dltKey.dltSecretKey]);
            let smartContractAddress = await getContractAddress(overledgerSDK, finaliseParams.dltKey, smartContractByteCodeSha256Hash);
            console.log(`smartContractAddress ${smartContractAddress}`);
            finaliseHash = await finaliseRequest(overledgerSDK, finaliseParams.dltKey, smartContractAddress, finaliseParams.requestId, finaliseParams.xrpHash, finaliseParams.feePrice, finaliseParams.feeLimit);
            console.log(`finalise`, finaliseHash);
            isFinalised = await checkForTransactionConfirmation(overledgerSDK, finaliseHash, 0, 1000);
            if (isFinalised) {
                toReturn = {
                    success: true,
                    msg: { transactionHash: finaliseHash }
                };
            } else {
                toReturn = {
                    success: false,
                    msg: "finalise request transaction hash is not confirmed"
                };
            }
        } else {
            toReturn = {
                success: false,
                msg: "Params_Not_Valid: " + validationFeedback
            }
        }
    } catch (e) {
        console.error('error', e);
        toReturn = {
            success: false,
            msg: 'error:_' + e
        }
    }
    return res.send(toReturn);
});


app.post('/ReadRequestId', async function (req, res) {
    let readIdParams = req.body;
    let overledgerSDK = await instantiateOverledgerInstance(overledgerMappId, OverledgerBpiKey, [DltNameOptions.ETHEREUM], network);
    await addAccountsToOverledger(overledgerSDK, [DltNameOptions.ETHEREUM], [readIdParams.dltKey.dltSecretKey]);
    let smartContractAddress = await getContractAddress(overledgerSDK, readIdParams.dltKey, smartContractByteCodeSha256Hash);
    const resp = await readParamValue(overledgerSDK, readIdParams.dltKey, readIdParams.paramName, smartContractAddress);
    return res.send(resp.result[0]);
});

exports.treatyContractUrl = treatyContractUrl;