const bitcoin = require('bitcoinjs-lib');
const network = bitcoin.networks.testnet;


// PartyA
// Bitcoin account:
//  { privateKey: 'cUk9izv1EPDSB2CJ7sf6RdVa6BDUWUBN8icE2LVW5ixvDApqBReT',
//   address: 'mfYHTfMs5ptQpWoefcdt9RWi3WTWGeSB7J' }

// PartyB
// Bitcoin account:
//  { privateKey: 'cQYWyycWa8KXRV2Y2c82NYPjdJuSy7wpFMhauMRVNNPFxDyLaAdn',
//   address: 'mxvHBCNoT8mCP7MFaERVuBy9GMzmHcR9hj' }

// PartyC
// Bitcoin account:
//  { privateKey: 'cSiJocehbCKWFGivZdN56jt2AE467EKQGcAuDbvvX9WiHsuGcb32',
//   address: 'n3oitdxMxaVeo1iUQpm4EyzxyWDZagyqEu' }

const NETWORK = bitcoin.networks.testnet;

function getPublicKey(privateKey) {
  return { publicKeyBuffer: bitcoin.ECPair.fromWIF(privateKey, bitcoin.networks.testnet).publicKey, privateKeyBuffer: bitcoin.ECPair.fromWIF(privateKey, bitcoin.networks.testnet).privateKey };
}

const pubKeyA = getPublicKey('cUk9izv1EPDSB2CJ7sf6RdVa6BDUWUBN8icE2LVW5ixvDApqBReT');
const pubKeyB = getPublicKey('cQYWyycWa8KXRV2Y2c82NYPjdJuSy7wpFMhauMRVNNPFxDyLaAdn');
const pubKeyC = getPublicKey('cSiJocehbCKWFGivZdN56jt2AE467EKQGcAuDbvvX9WiHsuGcb32');

function createP2MSObject(numberCoSigners, listPublicKeys) {
  const pubKeys = listPublicKeys.map(k => {
    console.log(`k ${k.toString('hex')}`);
    if (typeof k === 'string') {
      return Buffer.from(k, 'hex');
    } else
      return k;
  });
  const p2ms = bitcoin.payments.p2ms({
    m: numberCoSigners,
    pubkeys: pubKeys,
    network
  });
  return p2ms;
}

const p2ms = createP2MSObject(2, [pubKeyA.publicKeyBuffer, pubKeyB.publicKeyBuffer, pubKeyC.publicKeyBuffer]);

console.log(`p2ms ${JSON.stringify(p2ms)}`);

const p2sh = bitcoin.payments.p2sh({ redeem: p2ms, NETWORK });

console.log(`p2sh object ${JSON.stringify(p2sh)}`);
console.log(`p2sh address ${p2sh.address}`);
console.log(`output script ${p2sh.output.toString('hex')}`);
console.log(`redeemScript ${p2sh.redeem.output.toString('hex')}`);
