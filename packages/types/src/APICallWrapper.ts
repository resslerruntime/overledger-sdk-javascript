import SequenceDataRequest from './SequenceDataRequest';
import SignedTransactionRequest from './SignedTransactionRequest';

export type APICallWrapper = {
  mappId: string,
  dltData: SignedTransactionRequest[] | SequenceDataRequest[],
};

export default APICallWrapper;
