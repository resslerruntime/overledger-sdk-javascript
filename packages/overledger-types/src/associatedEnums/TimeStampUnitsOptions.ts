/**
 * The list of timestamp options. If other is chosen, make sure to clarify this in the extraFields section.
 * /

/**
 * @memberof module:overledger-types
 */

export enum TimeStampUnitOptions {
    ISO_DATE = 'ISO_DATE', // Standard code: iso
    BLOCK_HEIGHT = 'BLOCK_HEIGHT',
    FULL_DATE_TIME_SHORT = 'FULL_DATE_TIME_SHORT', // Standard code: fs 
    FULL_DATE_TIME_LONG = 'FULL_DATE_TIME_LONG', // Standard code: fl
    GENERAL_DATE_TIME_SHORT = 'GENERAL_DATE_TIME_SHORT', // Standard code: gs
    GENERAL_DATE_TIME_LONG = 'GENERAL_DATE_TIME_LONG',  // Standard code: gl
    UNIVERSAL_DATE_TIME_SORTABLE = 'UNIVERSAL_DATE_TIME_SORTABLE', // Standard code: us
    UNIVERSAL_DATE_TIME_FULL = 'UNIVERSAL_DATE_TIME_FULL', // Standard code: uf
}

export default TimeStampUnitOptions;
