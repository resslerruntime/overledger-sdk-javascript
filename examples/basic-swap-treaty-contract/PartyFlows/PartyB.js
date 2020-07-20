const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const request = require('request-promise-native');
const DltKey = require('../TypeDefinitions/DltKey').default;
const sleep = require('../treaty-contract-functions').sleep;

const treatyContractUrl = "http://localhost:4000";

const ethPrivateKey = "0x3FF22F5B016E967FFF2999254FB91691331E7B6130D12ED3B69B69873B330853";
const ethAddress = "0x105360Ba21773A9175A8daba66CA6C7654F7A3f2"; // najla MM account Party B
const XRPDropsToTrade = "2000000";
const xrpPrivateKey = "snqEbKR7aGBtEgC9A12CVR8f6i6jp";
const xrpAddress = "rfqrDC7Ux3XtVftA8v3SDkN63FL3sxRmEg";
const xrpReceiverAddress = "r94KZWGqrmpPdrWZxdzGkYCj12SBYTGxCE";
const ethDltKey = new DltKey(DltNameOptions.ETHEREUM, ethAddress, ethPrivateKey);
const xrpDltKey = new DltKey(DltNameOptions.XRP_LEDGER, xrpAddress, xrpPrivateKey);

runFlow();

async function runFlow() {
  const requestId = await readRequestId({ dltKey: ethDltKey, paramName: "requestCounter" });
  console.log(`requestId ${requestId}`);
  let newRequestId = await readRequestId({ dltKey: ethDltKey, paramName: "requestCounter" });
  while (newRequestId <= requestId) {
    sleep(10000);
    newRequestId = await readRequestId({ dltKey: ethDltKey, paramName: "requestCounter" });
  }
  console.log(`newRequestId ${newRequestId}`);

  const xrpTransactionHash = await sendXRP({ dltKey: xrpDltKey, destination: xrpReceiverAddress, amount: XRPDropsToTrade });
  console.log(`xrpTransactionHash ${JSON.stringify(xrpTransactionHash)}`);

  const finaliseRequestHash = await finaliseRequest({ dltKey: ethDltKey, requestId: requestId, xrpHash: xrpTransactionHash.msg.transactionHash.toString(), feePrice: '13000000000', feeLimit: '4397098' })
  console.log(`finaliseRequestHash ${JSON.stringify(finaliseRequestHash)}`);
}

async function readRequestId(readParamObject) {
  console.log("****READ REQUEST ID****");
  const options = {
    uri: new URL("ReadRequestId", treatyContractUrl).href,
    body: readParamObject,
    json: true
  }
  const resp = await request.post(options);
  return resp;

}

async function sendXRP(sendXrpObject) {
  console.log("****SEND XRP TO PARTY A****");
  const options = {
    uri: new URL("SendXRP", treatyContractUrl).href,
    body: sendXrpObject,
    json: true
  }
  const resp = await request.post(options);
  return resp;

}

async function finaliseRequest(finaliseObject) {
  console.log("****FINALISE REQUEST****");
  const options = {
    uri: new URL("FinaliseRequest", treatyContractUrl).href,
    body: finaliseObject,
    json: true
  }
  const resp = await request.post(options);
  return resp;
}