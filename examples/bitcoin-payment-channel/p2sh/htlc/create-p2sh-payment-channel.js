//NOTE: replace @quantnetwork/ with ../../packages/ for all require statements below if you have not built the SDK yourself
const bip65 = require('bip65');
const sha256 = require('crypto-js/sha256');
const OverledgerSDK = require('@quantnetwork/overledger-bundle').default;
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const TransactionBitcoinScriptTypeOptions = require('@quantnetwork/overledger-dlt-bitcoin').TransactionBitcoinScriptTypeOptions;
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
    const timeLock = bip65.encode({ blocks: 1903500 }); // better to call get block height later + 50 blocks
    console.log(`Time Lock: ${timeLock}`);

    overledger.dlts.bitcoin.setAccount({ privateKey: partyBBitcoinPrivateKey} );
    const claimPublicKey = overledger.dlts.bitcoin.account.publicKey;
    console.log(`claimPublicKey ${claimPublicKey}`);
    overledger.dlts.bitcoin.setAccount({ privateKey: partyABitcoinPrivateKey} );
    const refundPublicKey =  overledger.dlts.bitcoin.account.publicKey;
    console.log(`refundPublicKey ${refundPublicKey}`);

    const currentContractCode = generateHashTimeLockContractCode(claimPublicKey, refundPublicKey, hashSecret, timeLock);
    const p2shPaymentChannel = createHashTimeLockContractPaymentChannel(currentContractCode, TransactionBitcoinScriptTypeOptions.P2SH, overledger.dlts.bitcoin.addressType);
    console.log(`p2sh ${JSON.stringify(p2shPaymentChannel)}`);
    console.log(`p2sh address: ${p2shPaymentChannel.address}`);
    console.log(`p2sh output script: ${p2shPaymentChannel.output.toString('hex')}`);
    console.log(`p2sh redeem script: ${p2shPaymentChannel.redeem.output.toString('hex')}`);
  } catch (e) {
    console.error('error:', e);
  }
})();