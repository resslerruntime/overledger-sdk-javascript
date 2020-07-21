const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const request = require('request-promise-native');
const DltKey = require('../TypeDefinitions/DltKey').default;

const treatyContractUrl = "http://localhost:4000";
const ethPrivateKey = "0x1969D2C1EF82A5D1844C9C3A49A66245B2E927A6BC1D9F7F64B1376588A53B01";
const ethAddress = "0x7e0A65af0Dae83870Ce812F34C3A3D8626530d10";
const receiverAddress = "0x105360Ba21773A9175A8daba66CA6C7654F7A3f2";
const ethAmount = 0.1 * Math.pow(10, 18);
const ethDltKey = new DltKey(DltNameOptions.ETHEREUM, ethAddress, ethPrivateKey);
const sleep = require('../treaty-contract-functions').sleep;


runFlow();

async function runFlow() {
    const initContractHash = await initialiseSmartContract({ dltKey: ethDltKey, redeploy: true, feePrice: '91000000000', feeLimit: '4397098' });
    if (initContractHash && initContractHash !== "") {
        console.log(`initContractHash ${initContractHash}`);
    }
    sleep(5000);
    const initOrderHash = await initNewRequest({ dltKey: ethDltKey, receiver: receiverAddress, amount: ethAmount.toString(), feePrice: '91000000000', feeLimit: '4397098' });
    console.log(`initOrderHash ${JSON.stringify(initOrderHash)}`);

}


async function initialiseSmartContract(initContractObject) {
    console.log("****Initialise the smart contract****");
    const options = {
        uri: new URL("InitialiseApp", treatyContractUrl).href,
        body: initContractObject,
        json: true
    }
    console.log(`initContractObject ${JSON.stringify(initContractObject)}`);
    const resp = await request.post(options);
    console.log(JSON.stringify(resp));
    if (resp.event == "paramsNotValid") {
        console.log("paramsNotValid: " + resp.result);
        process.exit(1);
    } else if (resp.event == "newContract") {
        console.log("newContract deployed at txHash: " + resp.result.dltData[0].transactionHash);
        console.log("ObjectKeys: " + Object.keys(resp.result.dltData[0]));
        return resp.result.dltData[0].transactionHash;
    } else if (resp.event == "SolidityHashFail") {
        console.log("Solidity code load fail: " + resp.result);
        process.exit(1);
    } else if (resp.msg.event == "ContractAlreadyDeployed") {
        console.log("Contract already deployed at transaction: " + resp.msg.result);
        return "";
    }
}


async function initNewRequest(initRequestObject) {
    console.log("****INIT NEW REQUEST****");
    const options = {
        uri: new URL("InitiateNewRequest", treatyContractUrl).href,
        body: initRequestObject,
        json: true
    }
    const resp = await request.post(options);
    return resp;
}