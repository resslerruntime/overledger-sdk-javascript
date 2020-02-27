/**
 * The list of transaction sub-type options for Ethereum
 * /

/**
 * @memberof module:overledger-dlt-ethereum
 */

export enum TransactionEthereumSubTypeOptions {
    VALUE_TRANSFER = 'VALUE_TRANSFER',
    SMART_CONTRACT_DEPLOY = 'SMART_CONTRACT_DEPLOY',
    SMART_CONTRACT_INVOCATION = 'SMART_CONTRACT_INVOCATION',
}

export default TransactionEthereumSubTypeOptions;
