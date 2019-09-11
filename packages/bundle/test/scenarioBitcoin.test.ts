import axios from 'axios';
import OverledgerSDK from '../src';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Dlt/Bitcoin', () => {
  let overledger;
  let account;
  let signedTransaction;

  beforeAll(() => {
    overledger = new OverledgerSDK('testmappid', 'testbpikey', {
      dlts: [{dlt: 'bitcoin',}],
    });
  });

  test('Can create a account', () => {
    account = overledger.dlts.bitcoin.createAccount();
    overledger.dlts.bitcoin.setAccount(account.privateKey);

    expect(account.privateKey.length).toBe(52);
    expect(account.address.length).toBe(34);
  });

  test('Cannot sign a bitcoin transaction without defining the options', () => {
    expect(() => overledger.dlts.bitcoin.sign('2NFj2CVhE5ru7werwXUNCbirUW6KDo2d', 'message')).toThrow('Transaction options must be defined.');
  });

  test('Cannot sign a bitcoin transaction without specifying a sequence', () => {
    expect(() => overledger.dlts.bitcoin.sign('2NFj2CVhE5ru7werwXUNCbirUW6KDo2d', 'message', {})).toThrow('options.sequence must be set up');
  });

  test('Cannot sign a bitcoin transaction without specifying a previousTransactionHash', () => {
    expect(() => overledger.dlts.bitcoin.sign('2NFj2CVhE5ru7werwXUNCbirUW6KDo2d', 'message', { sequence: 1 })).toThrow('options.previousTransactionHash must be set up');
  });

  test('Cannot sign a bitcoin transaction without specifying a value', () => {
    expect(() => overledger.dlts.bitcoin.sign('2NFj2CVhE5ru7werwXUNCbirUW6KDo2d', 'message', { sequence: 1, previousTransactionHash: '716b436d084fa8a23cc623411f84bdb581036a79f9519eefb36754c5e6fe1111' })).toThrow('options.value must be set up');
  });

  test('Cannot sign a bitcoin transaction without specifying a feePrice', () => {
    expect(() => overledger.dlts.bitcoin.sign('2NFj2CVhE5ru7werwXUNCbirUW6KDo2d', 'message', { sequence: 1, previousTransactionHash: '716b436d084fa8a23cc623411f84bdb581036a79f9519eefb36754c5e6fe1111', value: '1' })).toThrow('options.feePrice must be set up');
  });

  // @TODO: Needs to be fixed
  test.skip('Can sign a bitcoin transaction', async () => {
    signedTransaction = await overledger.dlts.bitcoin.sign('2NFj2CVhE5ru7werwXUNCbirUW6KDo2d', 'message', { sequence: 1, previousTransactionHash: '716b436d084fa8a23cc623411f84bdb581036a79f9519eefb36754c5e6fe1111', value: '1', feePrice: '1'});

    expect(signedTransaction.length).toBeGreaterThan(340);
    expect(signedTransaction.startsWith('020')).toBe(true);
  });

  // @TODO: Needs to be fixed
  test.skip('Can send a bitcoin signedTransaction', async () => {
    mockedAxios.post.mockResolvedValue({ status: 'broadcasted', dlt: 'bitcoin', transactionHash: '0123000000000000000000' });
    await overledger.dlts.bitcoin.send(signedTransaction);

    expect(mockedAxios.post).toBeCalledWith(`${overledger.overledgerUri}/transactions`, {
      mappId: 'testmappid',
      dltData:
        [{
          dlt: 'bitcoin',
          signedTransaction: expect.any(String),
          fromAddress: expect.any(String),
        }],
    });
  });
});
