/**
 * The list of smart contract expressiveness options. If other is chosen, make sure to clarify this in the additionFields section.
 * /

/**
 * @memberof module:overledger-types
 */

export enum ExpressivenessOptions { 
    turingComplete = "TC", //can execute code of arbitrary algorithmic complexity
    genericNonTuringComplete = "generic_NTC",  //cannot execute code of arbitrary algorithmic complexity and not application specific
    applicationSpecificNonTuringComplete = "app_NTC", //cannot execute code of arbitrary algorithmic complexity but has a few application specific features
    other = "other"

};

export default ExpressivenessOptions;