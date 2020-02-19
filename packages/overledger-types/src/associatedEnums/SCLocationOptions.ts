/**
 * The list of smart contract location options. If other is chosen, make sure to clarify this in the extraFields section.
 * /

/**
 * @memberof module:overledger-types
 */

export enum SCLocationOptions {
    onDistributedLedger = 'on_dl', // the smart contract resides as part of the distributed ledger
    offDistributedLedgerNotShared = 'off_dl_notshared',  // the smart contract resides off the distributed ledger and only in one location
    offDistributedLedgerPossiblyShared = 'off_dl_shared', // the smart contract resides off the distributed ledger and may exist in multiple locations
}

export default SCLocationOptions;
