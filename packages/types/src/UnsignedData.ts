import TransactionOptions from './TransactionOptions';

type UnsignedData = {
  dlt: string,
  toAddress: string,
  message: string,
  options: TransactionOptions,
};

export default UnsignedData;
