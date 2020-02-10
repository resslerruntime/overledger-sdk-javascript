/**
 * The list of transaction type options. If other is chosen, make sure to clarify this in the extraFields section.
 * /

/**
 * @memberof module:overledger-types
 */

export enum TransactionTypeOptions { 
  utxo = "utxo",
  accounts = "accs",
  other = "other"
};

export default TransactionTypeOptions;