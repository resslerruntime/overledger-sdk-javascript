import axios from 'axios';
import OverledgerSDK from '../src';
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;
const TransactionSubTypeOptions = require('@quantnetwork/overledger-types').TransactionSubTypeOptions;

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Dlt/Ethereum', () => {
  let overledger;
  let account;
  let signedTransaction;

  beforeAll(() => {
    overledger = new OverledgerSDK('testmappid', 'testbpikey', {
      dlts: [{ dlt: 'ethereum', }],
    });
  });

  test('Can create an account', () => {
    account = overledger.dlts.ethereum.createAccount();
    overledger.dlts.ethereum.setAccount(account.privateKey);

    expect(account.privateKey.length).toBe(66);
    expect(account.address.length).toBe(42);
  });

    //check all the required fields of the TransactionRequestObject have to be present
    test('Cannot sign an ethereum transaction without providing the dlt parameter', () => {
      expect(() => overledger.dlts.ethereum.sign({any: '...'})).toThrow("Error parameter: dlt. Error is: All transactions must have a dlt field");
    });
  
    test('Cannot sign an ethereum transaction without providing the type parameter', () => {
      expect(() => overledger.dlts.ethereum.sign({any: '...', dlt: DltNameOptions.ethereum})).toThrow('Error parameter: type. Error is: All transactions must have a type field');
    });
  
    test('Cannot sign an ethereum transaction without providing the subType parameter', () => {
      expect(() => overledger.dlts.ethereum.sign({any: '...', dlt: DltNameOptions.ethereum, type: TransactionTypeOptions.accounts})).toThrow('Error parameter: subType. Error is: All transactions must have a subType field');
    });
  
    test('Cannot sign an ethereum transaction without providing the message parameter', () => {
      expect(() => overledger.dlts.ethereum.sign({any: '...', dlt: DltNameOptions.ethereum, type: TransactionTypeOptions.accounts, subType: TransactionSubTypeOptions.valueTransfer})).toThrow('Error parameter: message. Error is: All transactions must have a message field. If no message is required, assign message to the empty string, i.e. message: ""');
    });
  
    //Check all the required fields of the TransactionAccountsRequest are present
    test('Cannot sign an ethereum transaction without providing the fromAddress parameter', () => {
      expect(() => overledger.dlts.ethereum.sign({any: '...', dlt: DltNameOptions.ethereum, type: TransactionTypeOptions.accounts, subType: TransactionSubTypeOptions.valueTransfer, message: ""})).toThrow('Error parameter: fromAddress. Error is: All transactions for accounts distributed ledgers must have the fromAddress field');
    });
    test('Cannot sign an ethereum transaction without providing the toAddress parameter', () => {
      expect(() => overledger.dlts.ethereum.sign({any: '...', dlt: DltNameOptions.ethereum, type: TransactionTypeOptions.accounts, subType: TransactionSubTypeOptions.valueTransfer, message: "", fromAddress: "abcdefg"})).toThrow('Error parameter: toAddress. Error is: All transactions for accounts distributed ledgers must have the toAddress field. If you do not want to set a toAddress (maybe you are creating an on-chain smart contract?), assign toAddress to the empty string, i.e. toAddress = ""');
    });
    test('Cannot sign an ethereum transaction without providing the sequence parameter', () => {
      expect(() => overledger.dlts.ethereum.sign({any: '...', dlt: DltNameOptions.ethereum, type: TransactionTypeOptions.accounts, subType: TransactionSubTypeOptions.valueTransfer, message: "", fromAddress: "abcdefg", toAddress: "pqrst"})).toThrow('Error parameter: sequence. Error is: All transactions for accounts distributed ledgers must have the sequence field as a number');
    });
  //check the required Ethereum fields and Ethereum specific validation on the above fields
  test('Cannot sign an ethereum transaction without providing the extraFields parameter', () => {
    expect(() => overledger.dlts.ethereum.sign({any: '...', dlt: DltNameOptions.ethereum, type: TransactionTypeOptions.accounts, subType: TransactionSubTypeOptions.valueTransfer, message: "", fromAddress: "abcdefg", toAddress: "pqrst", sequence: 1})).toThrow('Error parameter: extraFields. Error is: All transactions for XRP must have the extraFields field set with feePrice and maxLedgerVersion parameters within it');
  });
  test('Cannot sign an ethereum transaction without providing the extraFields.compLimit parameter', () => {
    expect(() => overledger.dlts.ethereum.sign({any: '...', dlt: DltNameOptions.ethereum, type: TransactionTypeOptions.accounts, subType: TransactionSubTypeOptions.valueTransfer, message: "", fromAddress: "abcdefg", toAddress: "pqrst", sequence: 1, extraFields: {any: "kjhg"}})).toThrow('Error parameter: extraFields.feePrice. Error is: All transactions for XRP must have the extraFields.feePrice field set');
  });
  test('Cannot sign an ethereum transaction without providing the extraFields.compUnitPrice parameter', () => {
    expect(() => overledger.dlts.ethereum.sign({any: '...', dlt: DltNameOptions.ethereum, type: TransactionTypeOptions.accounts, subType: TransactionSubTypeOptions.valueTransfer, message: "", fromAddress: "abcdefg", toAddress: "pqrst", sequence: 1, extraFields: {any: "kjhg",compLimit: "1"}})).toThrow('Error parameter: extraFields.maxLedgerVersion. Error is: All transactions for XRP must have the extraFields.maxLedgerVersion field set');
  });
  test('Cannot sign an ethereum transaction if the transaction is a smartContractDeploy and no smartContract field is provided', () => {
    expect(() => overledger.dlts.ethereum.sign({any: '...', dlt: DltNameOptions.ethereum, type: TransactionTypeOptions.accounts, subType: TransactionSubTypeOptions.smartContractDeploy, message: "", fromAddress: "abcdefg", toAddress: "pqrst", sequence: 1, extraFields: {any: "kjhg",compLimit: "1"}})).toThrow('Error parameter: extraFields.maxLedgerVersion. Error is: All transactions for XRP must have the extraFields.maxLedgerVersion field set');
  });
  test('Cannot sign an ethereum transaction if the transaction is a smartContractInvocation and a toAddress parameter has not been provided', () => {
    expect(() => overledger.dlts.ethereum.sign({any: '...', dlt: DltNameOptions.ethereum, type: TransactionTypeOptions.accounts, subType: TransactionSubTypeOptions.smartContractInvocation, message: "", fromAddress: "abcdefg", toAddress: "", sequence: 1, extraFields: {any: "kjhg",compLimit: "1000000", compUnitPrice: "50"}})).toThrow('If Transaction.subType === TransactionSubTypeOptions.smartContractInvocation then a transaction.toAddress needs to be set indicating the address of the smart contract to invoke.');
  });
  

  test('Can sign an ethereum transaction', async () => {
    signedTransaction = await overledger.dlts.ethereum.sign('0x0000000000000000000000000000000000000000', 'message', {
      amount: '0', feeLimit: '100', feePrice: '1', sequence: 1,
    });

    expect(signedTransaction.length).toBeGreaterThan(200);
    expect(signedTransaction.startsWith('0x')).toBe(true);
  });

  test('Can send an ethereum signedTransaction', async () => {
    mockedAxios.post.mockResolvedValue({ status: 'broadcasted', dlt: 'ethereum', transactionHash: '0x712df767d7adea8a16aebbf080bc14daf21d3f00d3f95817db0b45abe7631711' } as any);
    const signedTransactionRequest = {
      dlt: 'ethereum',
      fromAddress: '0x0000000000000000000000000000000000000000',
      amount: 0,
      signedTransaction: {
        signatures: [],
        transactions: [signedTransaction],
      },
    }
    await overledger.dlts.ethereum.send(signedTransactionRequest);

    expect(mockedAxios.post).toBeCalledWith('/transactions', {
      mappId: 'testmappid',
      dltData: [{
        dlt: 'ethereum',
        fromAddress: expect.any(String),
        amount: expect.any(Number),
        signedTransaction: expect.any(Object),
      }],
    });
  });
});
