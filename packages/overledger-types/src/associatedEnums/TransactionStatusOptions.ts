/**
 * The list of transaction status options.  If other is chosen, make sure to clarify this in the extraFields section.
 * /

/**
 * @memberof module:overledger-types
 */

export enum TransactionStatusOptions { 
    broadcast = "b",
    confirmed = "c"

};

export default TransactionStatusOptions;