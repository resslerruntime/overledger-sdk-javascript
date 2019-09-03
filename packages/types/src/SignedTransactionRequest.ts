import OverledgerSignedTransaction from './OverledgerSignedTransaction';

type SignedTransactionRequest = {
  dlt: string,
  fromAddress: string,
  amount: number,
  signedTransaction: OverledgerSignedTransaction,
};

export default SignedTransactionRequest;
