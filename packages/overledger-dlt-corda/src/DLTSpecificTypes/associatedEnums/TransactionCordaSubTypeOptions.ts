/**
 * The list of transaction sub-type options for corda
 * /

/**
 * @memberof module:overledger-dlt-corda
 */

export enum TransactionCordaSubTypeOptions {
    ASSET_CREATION = 'ASSET_CREATION',
    ASSET_TRANSFER = 'ASSET_TRANSFER',
    ASSET_CREATION_AND_TRANSFER = 'ASSET_CREATION_AND_TRANSFER',
    ASSET_DESTRUCTION = 'ASSET_DESTRUCTION',
    ASSET_CREATION_AND_DESTRUCTION = 'ASSET_CREATION_AND_DESTRUCTION',
    ASSET_TRANSFER_AND_DESTRUCTION = 'ASSET_TRANSFER_AND_DESTRUCTION',
    ASSET_CREATION_TRANSFER_AND_DESTRUCTION = 'ASSET_CREATION_TRANSFER_AND_DESTRUCTION'

}

export default TransactionCordaSubTypeOptions;