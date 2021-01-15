const bitcoin = require('bitcoinjs-lib');
import TransactionBitcoinScriptTypeOptions from './DLTSpecificTypes/associatedEnums/TransactionBitcoinScriptTypeOptions';

export function generateHashTimeLockContractCode(claimPublicKey: Buffer | HexString, refundPublicKey: Buffer | HexString, paymentHashSecret: Buffer | HexString, timelock: number) {
  let claimKey = (claimPublicKey instanceof Buffer) ? claimPublicKey.toString('hex') : claimPublicKey;
  let refundKey = (refundPublicKey instanceof Buffer) ? refundPublicKey.toString('hex') : refundPublicKey;
  let hashSecret = (paymentHashSecret instanceof Buffer) ? paymentHashSecret.toString('hex') : paymentHashSecret;
  return bitcoin.script.fromASM(
    `
     OP_HASH160
      ${bitcoin.crypto.ripemd160(hashSecret)}
      OP_EQUAL
      OP_IF
        ${claimKey}
      OP_ELSE
        ${bitcoin.script.number.encode(timelock).toString('hex')}
        OP_CHECKLOCKTIMEVERIFY
        OP_DROP
        ${refundKey}
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

type HexString = string;