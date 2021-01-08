const bitcoin = require('bitcoinjs-lib');
const bip65 = require('bip65');
const sha256 = require('crypto-js/sha256');

// PartyA
// Bitcoin account:
//  { privateKey: 'cUk9izv1EPDSB2CJ7sf6RdVa6BDUWUBN8icE2LVW5ixvDApqBReT',
//   address: 'mfYHTfMs5ptQpWoefcdt9RWi3WTWGeSB7J' }

// PartyB
// Bitcoin account:
//  { privateKey: 'cQYWyycWa8KXRV2Y2c82NYPjdJuSy7wpFMhauMRVNNPFxDyLaAdn',
//   address: 'mxvHBCNoT8mCP7MFaERVuBy9GMzmHcR9hj' }

const NETWORK = bitcoin.networks.testnet;

const secret = 'quantbitcoinpaymentchannel';

const hashSecret = sha256(secret).toString();
console.log(`Hash secret ${hashSecret}`);

const timelock = bip65.encode( {blocks: 1902800} );
console.log(`Timelock ${timelock}`);

function getPublicKey(privateKey){
  return { publicKeyBuffer: bitcoin.ECPair.fromWIF(privateKey, bitcoin.networks.testnet).publicKey, privateKeyBuffer: bitcoin.ECPair.fromWIF(privateKey, bitcoin.networks.testnet).privateKey };
}

function smartContractGenerator (claimPublicKey, refundPublicKey, paymentHashSecret, timelock) {
  return bitcoin.script.fromASM(
    `
     OP_HASH160
      ${bitcoin.crypto.ripemd160(Buffer.from(paymentHashSecret, 'hex')).toString('hex')}
      OP_EQUAL
      OP_IF
        ${claimPublicKey.toString('hex')}
      OP_ELSE
        ${bitcoin.script.number.encode(timelock).toString('hex')}
        OP_CHECKLOCKTIMEVERIFY
        OP_DROP
        ${refundPublicKey.toString('hex')}
      OP_ENDIF
      OP_CHECKSIG
    `
      .trim()
      .replace(/\s+/g, ' '),
  );
}

// the claim public key creates the smart contract --> has the secret + hash secret --> Party B
// refund public key (Party A) is the user who is sending the btc to the smart contract, then it will be unlocked later by Party B (as it has the secret)

const pubKeyA = getPublicKey('cUk9izv1EPDSB2CJ7sf6RdVa6BDUWUBN8icE2LVW5ixvDApqBReT');
const pubKeyB = getPublicKey('cQYWyycWa8KXRV2Y2c82NYPjdJuSy7wpFMhauMRVNNPFxDyLaAdn');

const currentPaymentChannel = smartContractGenerator(pubKeyB.publicKeyBuffer, pubKeyA.publicKeyBuffer, hashSecret, timelock);

console.log(`currentPaymentChannel ${currentPaymentChannel.toString('hex')}`);

const p2sh = bitcoin.payments.p2sh( {redeem: {output: currentPaymentChannel, NETWORK}, NETWORK});

console.log(`p2sh object ${JSON.stringify(p2sh)}`);
console.log(`p2sh address ${p2sh.address}`);
console.log(`output script ${p2sh.output.toString('hex')}`);
console.log(`redeemScript ${p2sh.redeem.output}`);


// 32UgbH1uoEo3jzY2vdsBjhP1yv9W6UMab1
// hash160(buffer) === ripemd160(sha256(buffer))

// Each utxos has a separate raw hex, you are using raw hex from my example for all outputs, which is a duplicate error. So how can get raw hex from txId quickly, You can fetch from this public API then take value of key hex:

// https://api.blockcypher.com/v1/btc/test3/txs/<txID here>?includeHex=true
// Or using your bitcoind node with getrawtransaction API. https://bitcoincore.org/en/doc/0.17.0/rpc/rawtransactions/getrawtransaction/