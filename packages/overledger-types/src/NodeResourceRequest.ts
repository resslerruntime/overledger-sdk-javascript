/**
 * Overledger node resource request object.
 * @typedef {Object} NodeResourceRequest
 * @property {string} dlt - The distributed ledger technology.
 * @property {Object} node - The node on the distributed ledger network
 * @property {Object} nodePermissions - If there is any permissioned to access this node
 * @property {Object} endpoint - The OVL endpoint associated with this resource
 * @property {Object} resourceObject - The payload this resource requires
 */

/**
 * @memberof module:overledger-types
 */
type NodeResourceRequest = {
  dlt: string,
  node?: string,
  nodePermissions?: Object,
  endpoint: string,
  resourceObject: Object,
};

export default NodeResourceRequest;
