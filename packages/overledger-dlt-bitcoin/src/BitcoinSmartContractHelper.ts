const bitcoin = require('bitcoinjs-lib');
import TransactionBitcoinScriptTypeOptions from './DLTSpecificTypes/associatedEnums/TransactionBitcoinScriptTypeOptions';

export function generateHashTimeLockContractCode(claimPublicKey, refundPublicKey, paymentHashSecret, timelock) {
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

export function createHashTimeLockContractPaymentChannel(currentPaymentChannel, scriptType, addressType) {
  if (scriptType === TransactionBitcoinScriptTypeOptions.P2SH) {
    const p2sh = bitcoin.payments.p2sh({ redeem: { output: currentPaymentChannel, addressType }, addressType });
    return p2sh;
  }
  if (scriptType === TransactionBitcoinScriptTypeOptions.P2WSH) {
    const p2wsh = bitcoin.payments.p2wsh({ redeem: { output: currentPaymentChannel, addressType }, addressType });
    return p2wsh;
  }
  if (scriptType === TransactionBitcoinScriptTypeOptions.P2SHP2WSH) {
    const p2wsh = bitcoin.payments.p2wsh({ redeem: { output: currentPaymentChannel, addressType }, network: this.addressType });
    const p2sh = bitcoin.payments.p2sh({ redeem: p2wsh, network: this.addressType });
    return p2sh;
  }
  return false;
}

export function getPublicKey(privateKey){
  return { publicKeyBuffer: bitcoin.ECPair.fromWIF(privateKey, bitcoin.networks.testnet).publicKey, privateKeyBuffer: bitcoin.ECPair.fromWIF(privateKey, bitcoin.networks.testnet).privateKey };
}