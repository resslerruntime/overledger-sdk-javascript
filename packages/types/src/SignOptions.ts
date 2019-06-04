import TransactionOptions from './TransactionOptions';

type SignOptions = [{
  dlt: string,
  toAddress: string,
  message: string,
  options: TransactionOptions,
}];

export default SignOptions;
