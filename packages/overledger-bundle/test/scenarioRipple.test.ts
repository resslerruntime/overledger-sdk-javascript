import axios from 'axios';
import OverledgerSDK from '../src';
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;
const TransactionXRPSubTypeOptions = require('@quantnetwork/overledger-dlt-ripple').TransactionXRPSubTypeOptions;


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Dlt/Ripple', () => {
  let overledger;
  let account;
  let signedTransaction;

  beforeAll(() => {
    overledger = new OverledgerSDK('testmappid', 'testbpikey', {
      dlts: [{ dlt: 'ripple', }],
    });
  });

  test('Can create an account', () => {
    account = overledger.dlts.ripple.createAccount();
    overledger.dlts.ripple.setAccount(account.privateKey);

    expect(account.privateKey).toMatch(/s[1-9A-HJ-NP-Za-km-z]{28}/);
    expect(account.address).toMatch(/r[1-9A-HJ-NP-Za-km-z]{25,34}/);
  });

  //check all the required fields of the TransactionRequestObject have to be present
  test('Cannot sign a ripple transaction without providing the dlt parameter', () => {
    expect(() => overledger.dlts.ripple.sign({any: '...'})).toThrow("Error parameter: dlt. Error is: All transactions must have a dlt field");
  });

  test('Cannot sign a ripple transaction without providing the type parameter', () => {
    expect(() => overledger.dlts.ripple.sign({any: '...', dlt: DltNameOptions.XRP_LEDGER})).toThrow('Error parameter: type. Error is: All transactions must have a type field');
  });

  test('Cannot sign a ripple transaction by providing an incorrect type parameter', () => {
    expect(() => overledger.dlts.ripple.sign({any: '...', dlt: DltNameOptions.XRP_LEDGER, type: "..."})).toThrow('Error parameter: type. Error is: You must select a type from TransactionTypeOptions');
  });

  test('Cannot sign a ripple transaction without providing the subType parameter', () => {
    expect(() => overledger.dlts.ripple.sign({any: '...', dlt: DltNameOptions.XRP_LEDGER, type: TransactionTypeOptions.ACCOUNTS})).toThrow('Error parameter: subType. Error is: All transactions must have a subType field');
  });

  test('Cannot sign a ripple transaction without providing the message parameter', () => {
    expect(() => overledger.dlts.ripple.sign({any: '...', dlt: DltNameOptions.XRP_LEDGER, type: TransactionTypeOptions.ACCOUNTS, subType: {name: TransactionXRPSubTypeOptions.VALUE_TRANSFER}})).toThrow('Error parameter: message. Error is: All transactions must have a message field. If no message is required, assign message to the empty string, i.e. message: ""');
  });

  //Check all the required fields of the TransactionAccountsRequest are present
  test('Cannot sign a ripple transaction without providing the fromAddress parameter', () => {
    expect(() => overledger.dlts.ripple.sign({any: '...', dlt: DltNameOptions.XRP_LEDGER, type: TransactionTypeOptions.ACCOUNTS, subType: {name: TransactionXRPSubTypeOptions.VALUE_TRANSFER}, message: ""})).toThrow('Error parameter: fromAddress. Error is: All transactions for accounts distributed ledgers must have the fromAddress field');
  });
  test('Cannot sign a ripple transaction without providing the toAddress parameter', () => {
    expect(() => overledger.dlts.ripple.sign({any: '...', dlt: DltNameOptions.XRP_LEDGER, type: TransactionTypeOptions.ACCOUNTS, subType: {name: TransactionXRPSubTypeOptions.VALUE_TRANSFER}, message: "", fromAddress: "abcdefg"})).toThrow('Error parameter: toAddress. Error is: All transactions for accounts distributed ledgers must have the toAddress field. If you do not want to set a toAddress (maybe you are creating an on-chain smart contract?), assign toAddress to the empty string, i.e. toAddress = ""');
  });
  test('Cannot sign a ripple transaction without providing the sequence parameter', () => {
    expect(() => overledger.dlts.ripple.sign({any: '...', dlt: DltNameOptions.XRP_LEDGER, type: TransactionTypeOptions.ACCOUNTS, subType: {name: TransactionXRPSubTypeOptions.VALUE_TRANSFER}, message: "", fromAddress: "abcdefg", toAddress: "pqrst"})).toThrow('Error parameter: sequence. Error is: All transactions for accounts distributed ledgers must have the sequence field as a number');
  });
  //check the required XRP fields and XRP specific validation on the above fields
  test('Cannot sign a ripple transaction by providing an incorrect subtype parameter', () => {
    expect(() => overledger.dlts.ripple.sign({any: '...', dlt: DltNameOptions.XRP_LEDGER, type: TransactionTypeOptions.ACCOUNTS, subType: {name: "..."}, message: "", fromAddress: "abcdefg", toAddress: "pqrst", sequence: 1})).toThrow('Error parameter: subType. Error is: You must select a subType from TransactionSubTypeOptions');
  });
  test('Cannot sign a ripple transaction without providing the extraFields parameter', () => {
    expect(() => overledger.dlts.ripple.sign({any: '...', dlt: DltNameOptions.XRP_LEDGER, type: TransactionTypeOptions.ACCOUNTS, subType: {name: TransactionXRPSubTypeOptions.VALUE_TRANSFER}, message: "", fromAddress: "abcdefg", toAddress: "pqrst", sequence: 1})).toThrow('Error parameter: extraFields. Error is: All transactions for XRP must have the extraFields field set with feePrice and maxLedgerVersion parameters within it');
  });
  test('Cannot sign a ripple transaction without providing the extraFields.feePrice parameter', () => {
    expect(() => overledger.dlts.ripple.sign({any: '...', dlt: DltNameOptions.XRP_LEDGER, type: TransactionTypeOptions.ACCOUNTS, subType: {name: TransactionXRPSubTypeOptions.VALUE_TRANSFER}, message: "", fromAddress: "abcdefg", toAddress: "pqrst", sequence: 1, extraFields: {any: "kjhg"}})).toThrow('Error parameter: extraFields.feePrice. Error is: All transactions for XRP must have the extraFields.feePrice field set');
  });
  test('Cannot sign a ripple transaction without providing the extraFields.maxLedgerVersion parameter', () => {
    expect(() => overledger.dlts.ripple.sign({any: '...', dlt: DltNameOptions.XRP_LEDGER, type: TransactionTypeOptions.ACCOUNTS, subType: {name: TransactionXRPSubTypeOptions.VALUE_TRANSFER}, message: "", fromAddress: "abcdefg", toAddress: "pqrst", sequence: 1, extraFields: {any: "kjhg",feePrice: "1"}})).toThrow('Error parameter: extraFields.maxLedgerVersion. Error is: All transactions for XRP must have the extraFields.maxLedgerVersion field set');
  });
  test('Cannot sign a ripple transaction when providing an empty toAddress parameter', () => {
    expect(() => overledger.dlts.ripple.sign({any: '...', dlt: DltNameOptions.XRP_LEDGER, type: TransactionTypeOptions.ACCOUNTS, subType: {name: TransactionXRPSubTypeOptions.VALUE_TRANSFER}, message: "", fromAddress: "abcdefg", toAddress: "", sequence: 1, extraFields: {any: "kjhg",feePrice: "1", maxLedgerVersion: "12345"}})).toThrow('Error parameter: toAddress. Error is: All transactions for XRP must have the toAddress field set to an address');
  });
  test('Cannot sign a ripple transaction when setting sequence = 0', () => {
    expect(() => overledger.dlts.ripple.sign({any: '...', dlt: DltNameOptions.XRP_LEDGER, type: TransactionTypeOptions.ACCOUNTS, subType: {name: TransactionXRPSubTypeOptions.VALUE_TRANSFER}, message: "", fromAddress: "abcdefg", toAddress: "abcdefg", sequence: 0, extraFields: {any: "kjhg",feePrice: "1", maxLedgerVersion: "12345"}})).toThrow('Error parameter: sequence. Error is: All transactions for XRP must have a sequence number greater than 0');
  });
  test('Cannot sign a ripple transaction without providing the amount parameter', () => {
    expect(() => overledger.dlts.ripple.sign({any: '...', dlt: DltNameOptions.XRP_LEDGER, type: TransactionTypeOptions.ACCOUNTS, subType: {name: TransactionXRPSubTypeOptions.VALUE_TRANSFER}, message: "", fromAddress: "abcdefg", toAddress: "abcdefg", sequence: 1, extraFields: {any: "kjhg",feePrice: "1", maxLedgerVersion: "12345"}})).toThrow('Error parameter: amount. Error is: A transactions for XRP must have an amount > 0');
  });
  test('Cannot sign a ripple transaction when setting the amount = 0', () => {
    expect(() => overledger.dlts.ripple.sign({any: '...', dlt: DltNameOptions.XRP_LEDGER, type: TransactionTypeOptions.ACCOUNTS, subType: {name: TransactionXRPSubTypeOptions.VALUE_TRANSFER}, message: "", fromAddress: "abcdefg", toAddress: "abcdefg", sequence: 1, amount: 0, extraFields: {any: "kjhg",feePrice: "1", maxLedgerVersion: "12345"}})).toThrow('Error parameter: amount. Error is: A transactions for XRP must have an amount > 0');
  });

  test('Can sign a ripple transaction', async () => {
    signedTransaction = await overledger.dlts.ripple.sign({any: '...', dlt: DltNameOptions.XRP_LEDGER, type: TransactionTypeOptions.ACCOUNTS, subType: {name: TransactionXRPSubTypeOptions.VALUE_TRANSFER}, message: "", fromAddress: "rndaCtYjxKq3vBTA3ER1SAPSgvQRMXQZnz", toAddress: "rLEBHTbZBeSaY4ghcjLQMYvFEgKFyoRXbp", sequence: 1, amount: 1, extraFields: {feePrice: "1", maxLedgerVersion: "12345"}});

    expect(signedTransaction.length).toBeGreaterThan(200);
    expect(signedTransaction.startsWith('120')).toBe(true);
  });

  test('Can send a ripple signedTransaction', async () => {
    mockedAxios.post.mockResolvedValue({ status: 'broadcasted', dlt: 'ripple', transactionHash: 'E8F7ED33E0FD8A06C33A00165508A556A958F2DC53AF4C5FC40FD93FA1A50693' } as any);
    const signedTransactionRequest = {
      dlt: 'ripple',
      fromAddress: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
      signedTransaction: {
        signatures: [],
        transactions: [signedTransaction],
      },
    }
    
    await overledger.dlts.ripple.send(signedTransactionRequest);

    expect(mockedAxios.post).toBeCalledWith('/transactions', {
      mappId: 'testmappid',
      dltData:
        [{
          dlt: 'ripple',
          fromAddress: expect.any(String),
          signedTransaction: expect.any(Object),
        }],
    });
  });
});
