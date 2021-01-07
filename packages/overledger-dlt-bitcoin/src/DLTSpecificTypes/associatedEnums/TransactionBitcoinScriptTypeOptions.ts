/**
 * The list of transaction sub-type options for Bitcoin.
 * /

/**
 * @memberof module:overledger-dlt-bitcoin
 */

export enum TransactionBitcoinScriptTypeOptions {
  P2PK = 'P2PK',
  P2PKH = 'P2PKH',
  P2SH = 'P2SH',
  P2WSH = 'P2WSH',
  P2MS = 'P2MS'
}

export default TransactionBitcoinScriptTypeOptions;
