import OverledgerSignedTransaction from './OverledgerSignedTransaction';

/**
 * @memberof module:types
 */
type SignedTransactionRequest = {
  dlt: string,
  fromAddress: string,
  amount: string,
  signedTransaction: OverledgerSignedTransaction,
};

export default SignedTransactionRequest;
