
/**
 * The list of distributed ledger options to use.
 * /

/**
 * @memberof module:overledger-types
 */

export enum DltNameOptions { 
    xrp = "ripple",
    ethereum = "ethereum",
    bitcoin = "bitcoin",
    hyperledgerFabric = "hyperledger_fabric",
    corda = "corda",
    quorum = "quorum",
    stellar = "stellar",
    iota = "iota",
    other = "other"

};

export default DltNameOptions;