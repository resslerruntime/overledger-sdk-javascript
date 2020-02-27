/**
 * The list of smart contract location options. If other is chosen, make sure to clarify this in the extraFields section.
 * /

/**
 * @memberof module:overledger-types
 */

export enum SCLocationOptions {
    ON_DISTRIBUTED_LEDGER = 'ON_DISTRIBUTED_LEDGER', // the smart contract resides as part of the distributed ledger
    OFF_DISTRIBUTED_LEDGER_NOT_SHARED = 'OFF_DISTRIBUTED_LEDGER_NOT_SHARED',  // the smart contract resides off the distributed ledger and only in one location
    OFF_DISTRIBUTED_LEDGER_POSSIBLY_SHARED = 'OFF_DISTRIBUTED_LEDGER_POSSIBLY_SHARED', // the smart contract resides off the distributed ledger and may exist in multiple locations
}

export default SCLocationOptions;
