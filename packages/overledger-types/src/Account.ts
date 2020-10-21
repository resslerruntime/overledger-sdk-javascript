/**
 * An Overledger Account instance for a single DLT.
 * @typedef {Object} Account
 * @property {string} privateKey - The private key of the account, used for signing transactions.
 * @property {string} address - The address or public key of the account, used for receiving messages.
 */

/**
 * @memberof module:overledger-types
 */
type Account = {
  privateKey: string,
  address: string,
  publicKey?: string,
  id?: string,
  password?: string,
  provider?: string
};

export default Account;
