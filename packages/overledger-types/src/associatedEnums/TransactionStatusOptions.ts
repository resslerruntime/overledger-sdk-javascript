/**
 * The list of transaction status options.  If other is chosen, make sure to clarify this in the extraFields section.
 * /

/**
 * @memberof module:overledger-types
 */

export enum TransactionStatusOptions {
    CREATED = 'CREATED',
    SIGNED = 'SIGNED',
    BROADCAST = 'BROADCAST',
    UNCONFIRMED = 'UNCONFIRMED',
    CONFIRMED = 'CONFIRMED',
    INVALID = 'INVALID',
    ERROR = 'ERROR',
}

export default TransactionStatusOptions;
