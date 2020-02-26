/**
 * The list of smart contract expressiveness options. If other is chosen, make sure to clarify this in the extraFields section.
 * /

/**
 * @memberof module:overledger-types
 */

export enum ExpressivenessOptions {
    TURING_COMPLETE = 'TURING_COMPLETE', // can execute code of arbitrary algorithmic complexity
    GENERICN_ON_TURING_COMPLETE = 'GENERIC_NON_TURING_COMPLETE',  // cannot execute code of arbitrary algorithmic complexity and not application specific
    APPLICATION_SPECIFIC_NON_TURING_COMPLETE = 'APPLICATION_SPECIFIC_NON_TURING_COMPLETE', // cannot execute code of arbitrary algorithmic complexity but has a few application specific features
}

export default ExpressivenessOptions;
