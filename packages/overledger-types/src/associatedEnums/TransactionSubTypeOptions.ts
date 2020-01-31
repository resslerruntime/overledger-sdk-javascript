
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