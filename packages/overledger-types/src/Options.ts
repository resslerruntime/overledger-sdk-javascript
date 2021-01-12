/**
 * Options for instantiating the SDK
 * @typedef {Object} Options
 * @property {string=} privateKey - The private key of the user account.
 */

// TODO: pick a better name for this

/**
 * @memberof module:overledger-types
 */
type Options = {
  privateKey?: string,
  privateKeysList?: [string],
  scriptType?: string,
  numberCoSigners?: number
};

export default Options;
