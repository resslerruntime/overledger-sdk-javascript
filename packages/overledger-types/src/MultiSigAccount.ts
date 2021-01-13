

/**
 * @memberof module:overledger-types
 */
type MultiSigAccount = {
    keys: [{ publicKey: Buffer, privateKey: Buffer, privateKeyWIF: string}],
    address: string,
    numberCoSigners: number,
    script?: string,
    redeemScript?: string,
    witnessScript?: string
};

export default MultiSigAccount;