//NOTE: replace @quantnetwork/ with ../../packages/ for all require statements below if you have not built the SDK yourself
const bitcoin = require('bitcoinjs-lib');
const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const generateHashTimeLockContractCode = require('@quantnetwork/overledger-dlt-bitcoin').generateHashTimeLockContractCode;
const createHashTimeLockContractPaymentChannel = require('@quantnetwork/overledger-dlt-bitcoin').createHashTimeLockContractPaymentChannel;
//  ---------------------------------------------------------
//  -------------- BEGIN VARIABLES TO UPDATE ----------------
//  ---------------------------------------------------------
const mappId = 'network.quant.testnet';
const bpiKey = 'joNp29bJkQHwEwP3FmNZFgHTqCmciVu5NYD3LkEtk1I';

// Paste in your bitcoin, ethereum and XRP ledger private keys.

// For Bitcoin you can generate an account using `OverledgerSDK.dlts.bitcoin.createAccount` then fund the address at the Bitcoin Testnet Faucet.
const partyABitcoinPrivateKey = 'cUk9izv1EPDSB2CJ7sf6RdVa6BDUWUBN8icE2LVW5ixvDApqBReT';
const partyBBitcoinPrivateKey = 'cQYWyycWa8KXRV2Y2c82NYPjdJuSy7wpFMhauMRVNNPFxDyLaAdn';

//  ---------------------------------------------------------
//  -------------- END VARIABLES TO UPDATE ------------------
//  ---------------------------------------------------------

; (async () => {
  try {
    // Connect to overledger and choose which distributed ledgers to use:
    const overledger = new OverledgerSDK(mappId, bpiKey, {
      dlts: [{ dlt: DltNameOptions.BITCOIN }],
      provider: { network: 'testnet' },
    });

    const secret = 'quantbitcoinpaymentchannel';
    const hashSecret = sha256(secret).toString();
    console.log(`Hash Secret: ${hashSecret}`);
    const timeLock = bip65.encode({ blocks: 1903500 }); // call get block height later + 50 blocks
    console.log(`Time Lock: ${timeLock}`);

    const claimPublicKey = overledger.dlts.bitcoin.setAccount({ privateKey: partyBBitcoinPrivateKey} ).publicKey;
    const refundPublicKey = overledger.dlts.bitcoin.setAccount({ privateKey: partyABitcoinPrivateKey} ).publicKey;

    const currentContractCode = generateHashTimeLockContractCode(claimPublicKey, refundPublicKey, hashSecret, timeLock);
    const p2wshPaymentChannel = createHashTimeLockContractPaymentChannel(currentContractCode, TransactionBitcoinScriptTypeOptions.P2WSH, overledger.dlts.bitcoin.addressType);
    console.log(`p2wsh address: ${p2wshPaymentChannel.address}`);
    console.log(`p2wsh output script: ${p2wshPaymentChannel.output.toString('hex')}`);
    console.log(`p2wsh redeem script: ${p2wshPaymentChannel.redeem.output.toString('hex')}`);
  } catch (e) {
    console.error('error:', e);
  }
})();