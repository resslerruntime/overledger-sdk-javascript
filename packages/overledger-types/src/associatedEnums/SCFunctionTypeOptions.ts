/**
 * The list of smart contract function type options. If other is chosen, make sure to clarify this in the extraFields section.
 * /

/**
 * @memberof module:overledger-types
 */

export enum SCFunctionTypeOptions {

    constructorWithNoParameters = 'const_no_params',
    constructorWithParameters = 'const_params',
    functionCallWithNoParameters = 'fc_no_params',
    functionCallWithParameters = 'fc_params',
}

export default SCFunctionTypeOptions;
