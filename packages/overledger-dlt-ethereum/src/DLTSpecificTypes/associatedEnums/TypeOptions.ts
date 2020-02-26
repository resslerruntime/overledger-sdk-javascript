/**
 * The list of Ethereum type options that can be used.  If other is chosen, make sure to clarify this in the additionFields section.
 */

/**
 * @memberof module:overledger-dlt-ethereum
 */
// **IMPORTANT NOTE: A CHANGE HERE MAY MESS UP SMART CONTRACT INTERACTION AND THE SELECTED ENUM IS PARSED AND PREPARED BEFORE SENT TO OVERLEDGER */
export enum EthereumTypeOptions { UINT_B = 'UINT_B', INT_B = 'INT_B', ADDRESS = 'ADDRESS', BOOLEAN = 'BOOLEAN', BYTES_B = 'BYTES_B', STRING = 'STRING', UINT_B_ARRAY = 'UINT_B_ARRAY', INT_B_ARRAY = 'INT_B_ARRAY', ADDRESS_ARRAY = 'ADDRESS_ARRAY', BOOLEAN_ARRAY = 'BOOLEAN_ARRAY', BYTES_B_ARRAY = 'BYTES_B_ARRAY' }

export default EthereumTypeOptions;
