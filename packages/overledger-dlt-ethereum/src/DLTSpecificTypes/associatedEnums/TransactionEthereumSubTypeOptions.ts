/**
 * The list of transaction sub-type options for Ethereum
 * /

/**
 * @memberof module:overledger-dlt-ethereum
 */

export enum TransactionEthereumSubTypeOptions {
    valueTransfer = 'value',
    smartContractDeploy = 'sc_deploy',
    smartContractInvocation = 'sc_invoke',
}

export default TransactionEthereumSubTypeOptions;
