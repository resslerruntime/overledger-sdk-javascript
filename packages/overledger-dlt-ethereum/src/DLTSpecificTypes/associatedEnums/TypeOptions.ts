/**
 * The list of Ethereum type options that can be used.  If other is chosen, make sure to clarify this in the additionFields section.
 * In UINT_B, INT_B, BYTES_B, UINT_B_ARRAY, INT_B_ARRAY, BYTES_B_ARRAY enum types' names, the  capital '_B'/ '_B_' is to reflect that number of bits must be defined to store the data type. For example, UINT_B can be uint8, unint16, unint32 or uint256.
 */

/**
 * @memberof module:overledger-dlt-ethereum
 */
// **IMPORTANT NOTE: A CHANGE HERE MAY MESS UP SMART CONTRACT INTERACTION AND THE SELECTED ENUM IS PARSED AND PREPARED BEFORE SENT TO OVERLEDGER */
export enum EthereumTypeOptions { UINT_B = 'UINT_B', INT_B = 'INT_B', ADDRESS = 'ADDRESS', BOOLEAN = 'BOOLEAN', BYTES_B = 'BYTES_B', STRING = 'STRING', UINT_B_ARRAY = 'UINT_B_ARRAY', INT_B_ARRAY = 'INT_B_ARRAY', ADDRESS_ARRAY = 'ADDRESS_ARRAY', BOOLEAN_ARRAY = 'BOOLEAN_ARRAY', BYTES_B_ARRAY = 'BYTES_B_ARRAY' }

export default EthereumTypeOptions;
