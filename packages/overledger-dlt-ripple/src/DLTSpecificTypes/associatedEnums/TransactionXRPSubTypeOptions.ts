/**
 * The list of transaction sub-type options for XRP.
 * /

/**
 * @memberof module:overledger-dlt-xrp
 */

export enum TransactionXRPSubTypeOptions { 
    valueTransfer = "value",
    trustline = "trust",
    escrowCreate = "escrow_cre",
    escrowExecute = "escrow_exe",
    escrowCancel = "escrow_can"

};

export default TransactionXRPSubTypeOptions;