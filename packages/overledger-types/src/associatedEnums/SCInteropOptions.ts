/**
 * @memberof module:overledger-types
 */
export enum SCInteropOptions {
    escrowCreation = 'escrow_create',
    escrowExecution = 'escrow_execute',
    escrowCancellation = 'escrow_cancel',
    migrationRequest = 'migrate_request',
    migrationExecution = 'migrate_execute',
    migrationCancellation = 'migrate_cancel',
    oracleRequest = 'oracle_request',
    oracleResponse = 'oracle_response',
  }

export default SCInteropOptions;
