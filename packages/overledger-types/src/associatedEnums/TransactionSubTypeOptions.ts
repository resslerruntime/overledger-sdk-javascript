/**
 * The list of transaction sub-type options. If other is chosen, make sure to clarify this in the extraFields section.
 * /

/**
 * @memberof module:overledger-types
 */

export enum TransactionSubTypeOptions { 
    valueTransfer = "value",
    smartContractDeploy = "sc_deploy",
    smartContractInvocation = "sc_invoke",
    other = "other"

};

export default TransactionSubTypeOptions;