/**
 * The list of transaction sub-type options for XRP.
 * /

/**
 * @memberof module:overledger-dlt-xrp
 */

export enum TransactionXRPSubTypeOptions {
    VALUE_TRANSFER = 'VALUE_TRANSFER',
    TRUSTLINE = 'TRUSTLINE',
    ESCROW_CREATION = 'ESCROW_CREATION',
    ESCROW_EXECUTION = 'ESCROW_EXECUTION',
    ESCROW_CANCELATION = 'ESCROW_CANCELATION',
}

export default TransactionXRPSubTypeOptions;
