/**
 * @memberof module:overledger-types
 */

export enum TimeStampUnitOptions { 
    isoDate = "iso",
    blockHeight = "bh",
    fullDateTimeShort = "fs",
    fullDateTimeLong = "fl",
    generalDateTimeShort = "gs",
    generalDateTimeLong = "gl",
    universalDateTimeSortable = "us",
    universalDateTimeFull = "uf",
    other = "other"
};

export default TimeStampUnitOptions;