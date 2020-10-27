import * as bitcoin from 'bitcoinjs-lib';
// import * as bip65 from 'bip65';

// npx ts-node sender-wallet.ts

// npx ts-node sender-wallet.ts: run only the .ts file examples (if it exists)
// npx tsc sender-wallet.ts (generate the js file)

// const NETWORK = bitcoin.networks.testnet;
// const pairA = bitcoin.ECPair.makeRandom({ network: NETWORK });
// const pairB = bitcoin.ECPair.makeRandom({ network: NETWORK });
// const pubKeyA = pairA.publicKey;
// const pubKeyB = pairB.publicKey;

// const pubKey1 = Buffer.from('04C16B8698A9ABF84250A7C3EA7EEDEF9897D1C8C6ADF47F06CF73370D74DCCA01CDCA79DCC5C395D7EEC6984D83F1F50C900A24DD47F569FD4193AF5DE762C587', 'hex');
// const pubKey2 = Buffer.from('04A2192968D8655D6A935BEAF2CA23E3FB87A3495E7AF308EDF08DAC3C1FCBFC2C75B4B0F4D0B1B70CD2423657738C0C2B1D5CE65C97D78D0E34224858008E8B49', 'hex');
// const pubKey3 = Buffer.from('047E63248B75DB7379BE9CDA8CE5751D16485F431E46117B9D0C1837C9D5737812F393DA7D4420D7E1A9162F0279CFC10F1E8E8F3020DECDBC3C0DD389D9977965', 'hex');
// const pubKey4 = Buffer.from('0421D65CBD7149B255382ED7F78E946580657EE6FDA162A187543A9D85BAAA93A4AB3A8F044DADA618D087227440645ABE8A35DA8C5B73997AD343BE5C2AFD94A5', 'hex');
// const pubKey5 = Buffer.from('043752580AFA1ECED3C68D446BCAB69AC0BA7DF50D56231BE0AABF1FDEEC78A6A45E394BA29A1EDF518C022DD618DA774D207D137AAB59E0B000EB7ED238F4D800', 'hex');

// const redeemScriptOPsArrayMultiSig = [ bitcoin.script.number.encode(2),
//                                        pubKey1,
//                                        pubKey2,
//                                        pubKey3,
//                                        pubKey4,
//                                        pubKey5,
//                                        bitcoin.script.number.encode(5),
//                                        bitcoin.opcodes.OP_CHECKMULTISIG ];
                          


// function cltvCheckSigOutputOld(redeemScriptOPsArray){
//    return bitcoin.script.compile(redeemScriptOPsArray);
// }                             

// const redeemScript = cltvCheckSigOutput(redeemScriptOPsArrayMultiSig);

// console.log(`redeemScript ${Buffer.from(redeemScript).toString('hex')}`);

// const redeemScriptHash = bitcoin.crypto.ripemd160(bitcoin.crypto.sha256(redeemScript));

// redeem script hash CORRECT !!
// console.log(`redeemScriptHash ${Buffer.from(redeemScriptHash).toString('hex')}`);

// const lockingScriptOPsArray = [ bitcoin.opcodes.OP_HASH160,
//                                 redeemScriptHash,
//                                 bitcoin.opcodes.OP_EQUAL ];
                      
                                               
// const lockingScript = cltvCheckSigOutput(lockingScriptOPsArray);
// console.log(`lockingScript ${Buffer.from(lockingScript).toString('hex')}`);

// const p2shAddress = bitcoin.address.toBase58Check(redeemScriptHash, bitcoin.networks.bitcoin.pubKeyHash);

// const p2shAddress = bitcoin.address.toBase58Check(Buffer.from("54c557e07dde5bb6cb791c7a540e0a4796f5e97e", "hex"), 5);

// console.log(`p2shAddress first way ${JSON.stringify(p2shAddress)}`);

// const p2shAddress2 = bitcoin.payments.p2sh( { redeem: { output: redeemScript } });
// const p2shAddress2 = bitcoin.payments.p2sh( { redeem: { output: redeemScript } }); use the input to spend the transaction from the address p2shAddress2

// console.log(`p2shAddress second way ${p2shAddress2.address}`);

// PartyA
// Bitcoin account:
//  { privateKey: 'cUk9izv1EPDSB2CJ7sf6RdVa6BDUWUBN8icE2LVW5ixvDApqBReT',
//   address: 'mfYHTfMs5ptQpWoefcdt9RWi3WTWGeSB7J' }

// PartyB
// Bitcoin account:
//  { privateKey: 'cQYWyycWa8KXRV2Y2c82NYPjdJuSy7wpFMhauMRVNNPFxDyLaAdn',
//   address: 'mxvHBCNoT8mCP7MFaERVuBy9GMzmHcR9hj' }



// const redeemScriptOPsArraySimplePaymentChannel = [ bitcoin.opcodes.OP_IF,
//                                                    pubKeyA,
//                                                    bitcoin.opcodes.OP_CHECKSIGVERIFY,
//                                                    // bitcoin.opcodes.OP_HASH160,
//                                                    // redeemScriptHash,
//                                                    // bitcoin.opcodes.OP_EQUAL,
//                                                    bitcoin.opcodes.OP_ELSE,
//                                                    pubKeyB,
//                                                    bitcoin.opcodes.OP_CHECKSIGVERIFY,
//                                                    //unlockTime,
//                                                    bitcoin.script.number.encode(2),
//                                                    bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY
//                                                   ];


// function getPublicKey(privateKey: string){
//   return { publicKeyBuffer: bitcoin.ECPair.fromWIF(privateKey, bitcoin.networks.testnet).publicKey, privateKeyBuffer: bitcoin.ECPair.fromWIF(privateKey, bitcoin.networks.testnet).privateKey };
// }
  
// const pubKeyA = getPublicKey('cUk9izv1EPDSB2CJ7sf6RdVa6BDUWUBN8icE2LVW5ixvDApqBReT');
// const pubKeyB = getPublicKey('cQYWyycWa8KXRV2Y2c82NYPjdJuSy7wpFMhauMRVNNPFxDyLaAdn');

// // see with number of blocks
// // const lockTime = bip65.encode({utc: Math.floor(Date.now() / 1000) - (3600 * 6)});
// const lockTime = 1601380409;
// console.log(`lockTime ${lockTime}`);

// const redeemScriptOPsArraySimplePaymentChannel = [ bitcoin.opcodes.OP_IF,
//                                                    pubKeyA,
//                                                    bitcoin.opcodes.OP_CHECKSIGVERIFY,
//                                                    bitcoin.opcodes.OP_ELSE,
//                                                    pubKeyB,
//                                                    bitcoin.opcodes.OP_CHECKSIGVERIFY,
//                                                    bitcoin.script.number.encode(lockTime),
//                                                    bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY,
//                                                    bitcoin.opcodes.OP_DROP,
//                                                    bitcoin.opcodes.OP_ENDIF
//                                                   ];                                                

// const redeemScriptPaymentChannel = cltvCheckSigOutputOld(redeemScriptOPsArraySimplePaymentChannel);   

// console.log(`redeemScriptPaymentChannel ${Buffer.from(redeemScriptPaymentChannel).toString('hex')}`);

// const redeemScriptPaymentChannelHash = bitcoin.crypto.ripemd160(bitcoin.crypto.sha256(redeemScriptPaymentChannel));

// console.log(`redeemScriptPaymentChannelHash ${Buffer.from(redeemScriptPaymentChannelHash).toString('hex')}`);

// const p2shAddress = bitcoin.payments.p2sh( { redeem: { output: redeemScriptPaymentChannel } });



// console.log(`p2shAddress ${Buffer.from(p2shAddress.output).toString('hex')}`);
// console.log(`p2shAddress ${JSON.stringify(p2shAddress)}`);

// 3BmR1ztM6YaDvp12PpVYJ3WWJHmgmy3DiC


// >  bitcoin.crypto.ripemd160(bitcoin.crypto.sha256(bitcoin.payments.p2sh( { redeem: { output: redeemScriptPaymentChannel } }).redeem.output));
// <Buffer 5a a0 a9 ea 40 76 a8 d0 82 1f 2b 0b 1b 65 1e bf 56 35 8a 0c>

// > bitcoin.payments.p2sh( { redeem: { output: redeemScriptPaymentChannel } }).output;
// <Buffer a9 14 5a a0 a9 ea 40 76 a8 d0 82 1f 2b 0b 1b 65 1e bf 56 35 8a 0c 87>


// const redeemScriptOPsArrayPaymentSwap

export function buildRedeemScript(publicKeyA, publicKeyB, lockTime) {
  const redeemScript = 
`OP_IF
    ${bitcoin.script.number.encode(lockTime).toString('hex')}
    OP_CHECKLOCKTIMEVERIFY
    OP_DROP
OP_ELSE
    ${publicKeyB.toString('hex')}
    OP_CHECKSIGVERIFY
OP_ENDIF
${publicKeyA.toString('hex')}
OP_CHECKSIG`
  return redeemScript;
}



export function cltvCheckSigOutput(redeemScript) {
  return bitcoin.script.fromASM(
      redeemScript
      .trim()
      .replace(/\s+/g, ' '),
  );
}

export function utcNow() {
  return Math.floor(Date.now() / 1000);
}