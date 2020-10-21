/**
 * Return the  for loading a DLT in the SDK.
 * @typedef {Object} LedgerVersion
 * @property {string} dlt - The distributed ledger technology.
 * @property {string} version - The ledger version
 */

/**
 * @memberof module:overledger-types
 */
type LedgerVersion = {
  dlt: string,
  version: string,
};

export default LedgerVersion;