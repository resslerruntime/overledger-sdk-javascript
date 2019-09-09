import OverledgerSignedTransaction from './OverledgerSignedTransaction';

type SignedTransactionRequest = {
  dlt: string,
  fromAddress: string,
  amount: string,
  signedTransaction: OverledgerSignedTransaction,
};

export default SignedTransactionRequest;
