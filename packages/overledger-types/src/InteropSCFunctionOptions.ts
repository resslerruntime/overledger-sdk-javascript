/**
 * @memberof module:overledger-types
 */
export enum InteropSCFunctionOptions {
    escrowCreation = "escrow_create",
    escrowExecution = "escrow_execute",
    escrowCancellation = "escrow_cancel",
    migrationRequest = "migrate_request",
    migrationExecution = "migrate_execute",
    migrationCancellation = "migrate_cancel",
    oracleRequest = "oracle_request",
    oracleResponse = "oracle_response",
    other = "other" 
  };

export default InteropSCFunctionOptions;
