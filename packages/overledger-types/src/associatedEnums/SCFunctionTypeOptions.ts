/**
 * The list of smart contract function type options. If other is chosen, make sure to clarify this in the extraFields section.
 * /

/**
 * @memberof module:overledger-types
 */

export enum SCFunctionTypeOptions {

    CONSTRUCTOR_WITH_NO_PARAMETERS = 'CONSTRUCTOR_WITH_NO_PARAMETERS',
    CONSTRUCTOR_WITH_PARAMETERS = 'CONSTRUCTOR_WITH_PARAMETERS',
    FUNCTION_CALL_WITH_NO_PARAMETERS = 'FUNCTION_CALL_WITH_NO_PARAMETERS',
    FUNCTION_CALL_WITH_PARAMETERS = 'FUNCTION_CALL_WITH_PARAMETERS',
}

export default SCFunctionTypeOptions;
