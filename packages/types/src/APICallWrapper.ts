import SequenceDataRequest from './SequenceDataRequest';
import APICall from './APICall';

export type APICallWrapper = {
  mappId: string,
  dltData: APICall[] | SequenceDataRequest[],
};

export default APICallWrapper;
