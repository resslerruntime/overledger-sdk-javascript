/**
 * DLT transaction options.
 * @typedef {Object} extraFields
 * @property {number=} sequence - This transaction's sequence in relation to the initiating account.
 * @property {string} amount - The amount of tokens in the lowest unit available on the DLT.
 */

/**
 * @memberof module:overledger-types
 */
type extraFields = {
  fee?: number
  //any other standards
};

export default extraFields;
