/**
 * @memberof module:overledger-types
 */
export enum SCFunctionalityOptions {
    escrowCreation = "ESCROW_CREATION",
    escrowExecution = "ESCROW_EXECUTION",
    escrowCancellation = "ESCROW_CANCELLATION",
    migrationRequest = "MIGRATION_REQUEST",
    migrationExecution = "MIGRATION_EXECUTION",
    migrationCancellation = "MIGRATION_CANCELLATION",
    oracleRequest = "ORACLE_REQUEST",
    oracleResponse = "ORACLE_RESPONSE" 
  };

export default SCFunctionalityOptions;
