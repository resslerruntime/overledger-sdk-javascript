import axios from 'axios';
import OverledgerSDK from '../src';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Dlt/RippleAndEthereum', () => {
  describe('Main read functions', () => {
    test('Can getSequences for specific addresses', async () => {
      const overledger = new OverledgerSDK('testmappid', 'testbpikey', {
        dlts: [
          { dlt: 'ripple', },
          { dlt: 'ethereum', },
        ],
      });

      mockedAxios.post.mockResolvedValue(
        {
          dltData: [
            {
              sequence: 2,
              dlt: 'ripple',
            },
            {
              sequence: 0,
              dlt: 'ethereum',
            },
          ],
        },
      );

      const params = [
        {
          dlt: 'ethereum',
          address: '0xA72a14Cdca45D51326d394B2ddAFb408270Ae101',
        },
        {
          dlt: 'ripple',
          address: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
        },
      ];

      await overledger.getSequences(params);

      expect(mockedAxios.post).toBeCalledWith('/sequence', {
        dltData: [
          {
            dlt: 'ethereum',
            address: expect.any(String),
          },
          {
            dlt: 'ripple',
            address: expect.any(String),
          },
        ],
      });
    });

    test('Can getSequence for a specific address', async () => {
      const ethAddress = '0xA72a14Cdca45D51326d394B2ddAFb408270Ae101';
      const overledger = new OverledgerSDK('testmappid', 'testbpikey', {
        dlts: [
          {
            dlt: 'ripple',
          },
          {
            dlt: 'ethereum',
          },
        ],
      });

      mockedAxios.post.mockResolvedValue([
        {
          dltData: [
            {
              sequence: 1,
              dlt: 'ethereum',
            },
          ],
        },
      ]);

      await overledger.dlts.ethereum.getSequence(ethAddress);

      expect(mockedAxios.post).toBeCalledWith('/sequence', {
        dltData: [
          {
            dlt: 'ethereum',
            address: expect.any(String),
          },
        ],
      });
    });

    test('Can read transactions from mappId', async () => {
      const overledger = new OverledgerSDK('testmappid', 'testbpikey', {
        dlts: [
          {
            dlt: 'ripple',
          },
          {
            dlt: 'ethereum',
          },
        ],
      });

      mockedAxios.get.mockResolvedValue([
        {
          mappId: 'mappTestId',
          overledgerTransactionId: 'c2559f8d-d181-4ba3-9012-a47d6b6c6111',
          timestamp: '2018-09-07T10:29:50.695Z',
          dltData: [
            {
              dlt: 'ethereum',
              transactionHash: '0xa3f8277dd54f1341dec3dfae3ad844ad8a226faa511e05b7dfe1e9de55481111',
              status: 'broadcasted',
              errorReason: null,
              links: [],
            },
          ],
        },
      ]);

      await overledger.readTransactionsByMappId();

      expect(mockedAxios.get).toBeCalledWith('/transactions/mappid/testmappid');
    });

    test('Can read transactions by overledger transaction id', async () => {
      const overledger = new OverledgerSDK('testmappid', 'testbpikey', {
        dlts: [
          {
            dlt: 'ripple',
          },
          {
            dlt: 'ethereum',
          },
        ],
      });

      mockedAxios.get.mockResolvedValue({
        mappId: 'mappTestId',
        overledgerTransactionId: '70cb4832-bbd0-400f-a6d8-2add51deb111',
        timestamp: '2018-09-07T23:36:49.832Z',
        dltData: [
          {
            dlt: 'ethereum',
            transactionHash: '0x712df767d7adea8a16aebbf080bc14daf21d3f00d3f95817db0b45abe7631111',
            status: 'broadcasted',
            errorReason: null,
            links: [],
          },
        ],
      });

      const transactionId = '70cb4832-bbd0-400f-a6d8-2add51deb111';
      await overledger.readByTransactionId(transactionId);

      expect(mockedAxios.get).toBeCalledWith(`/transactions/id/${transactionId}`);
    });
  });

  describe('Using ripple & ethereum without injecting the privatekey in the DLT array', () => {
    let overledger;
    let ethereumAccount;
    let rippleAccount;
    let ethereumSignedTransaction;
    let rippleSignedTransaction

    test('Load ripple and ethereum DLTs', async () => {
      overledger = new OverledgerSDK('testmappid', 'testbpikey', {
        dlts: [
          {
            dlt: 'ripple',
          },
          {
            dlt: 'ethereum',
          },
        ],
      });

      expect(overledger.dlts.ethereum).toBeDefined();
      expect(overledger.dlts.ripple).toBeDefined();
    });

    test('Can generate & set account for ethereum & ripple', async () => {
      rippleAccount = overledger.dlts.ripple.createAccount();
      ethereumAccount = overledger.dlts.ethereum.createAccount();

      overledger.dlts.ripple.setAccount(rippleAccount.privateKey);
      overledger.dlts.ethereum.setAccount(ethereumAccount.privateKey);

      expect(overledger.dlts.ripple.account.privateKey).toBe(rippleAccount.privateKey);
      expect(overledger.dlts.ethereum.account.privateKey).toBe(ethereumAccount.privateKey);
    });

    test('Can sign ripple & ethereum transactions', async () => {
      rippleSignedTransaction = await overledger.sign(
        {
          dlt: 'ripple',
          toAddress: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
          message: 'QNT test',
          options: {
            sequence: 1,
            amount: 1,
            feePrice: '0.000012',
            maxLedgerVersion: 100000000,
          },
        },
      )
      ethereumSignedTransaction = await overledger.sign(
        {
          dlt: 'ethereum',
          toAddress: '0x0000000000000000000000000000000000000000',
          message: 'QNT test',
          options: {
            amount: 0,
            feeLimit: 100,
            feePrice: 1,
            sequence: 1,
          },
        },
      );

      expect(typeof ethereumSignedTransaction).toBe('string');
      expect(typeof rippleSignedTransaction).toBe('string');
    });

    test('Can send ripple & ethereum signedTransactions', async () => {
      mockedAxios.post.mockResolvedValue([
        { dlt: 'ripple', status: 'broadcasted', transactionHash: '716b436d084fa8a23cc623411f84bdb581036a79f9519eefb36754c5e6fe1111' },
        { dlt: 'ethereum', status: 'broadcasted', transactionHash: '0x712df767d7adea8a16aebbf080bc14daf21d3f00d3f95817db0b45abe7631711' },
      ]);

      const signedTransactions = [
        {
          dlt: 'ripple',
          fromAddress: rippleAccount.address,
          amount: 1,
          signedTransaction: {
            signatures: [],
            transactions: [rippleSignedTransaction]
          },
        },
        {
          dlt: 'ethereum',
          fromAddress: ethereumAccount.address,
          amount: 0,
          signedTransaction: {
            signatures: [],
            transactions: [ethereumSignedTransaction]
          },
        }
      ]
      await overledger.send(signedTransactions);

      expect(mockedAxios.post).toBeCalledWith('/transactions', {
        mappId: 'testmappid',
        dltData:
          [
            {
              dlt: 'ripple',
              fromAddress: expect.any(String),
              amount: expect.any(Number),
              signedTransaction: expect.any(Object),
            },
            {
              dlt: 'ethereum',
              fromAddress: expect.any(String),
              amount: expect.any(Number),
              signedTransaction: expect.any(Object),
            },
          ],
      });
    });
  });

  describe('Using ripple & ethereum with injecting the privatekey in the DLT array', () => {
    let overledger;
    let ethereumAccount;
    let rippleAccount;
    let ethereumSignedTransaction;
    let rippleSignedTransaction;

    test('Load ripple and ethereum DLTs', async () => {
      overledger = new OverledgerSDK('testmappid', 'testbpikey', {
        dlts: [
          {
            dlt: 'ripple', privateKey: 'shL8VmeBqoB7CnbPjXmfue7zeBeeg',
          },
          {
            dlt: 'ethereum', privateKey: '0xe58af4f4a4a509b0190d87bdcd6d05ec4c274cfdd2282f4d196da6466d56c621',
          },
        ],
      });

      expect(overledger.dlts.ethereum).toBeDefined();
      expect(overledger.dlts.ripple).toBeDefined();
    });

    test('Can generate & set account for ethereum & ripple', async () => {
      rippleAccount = overledger.dlts.ripple.createAccount();
      ethereumAccount = overledger.dlts.ethereum.createAccount();

      overledger.dlts.ripple.setAccount(rippleAccount.privateKey);
      overledger.dlts.ethereum.setAccount(ethereumAccount.privateKey);

      expect(overledger.dlts.ripple.account.privateKey).toBe(rippleAccount.privateKey);
      expect(overledger.dlts.ethereum.account.privateKey).toBe(ethereumAccount.privateKey);
    });

    test('Can sign ripple & ethereum transactions', async () => {
      rippleSignedTransaction = await overledger.sign(
        {
          dlt: 'ripple',
          toAddress: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
          message: 'QNT test',
          options: {
            sequence: 1,
            amount: 1,
            feePrice: '0.000012',
            maxLedgerVersion: 100000000,
          },
        },
      )
      ethereumSignedTransaction = await overledger.sign(
        {
          dlt: 'ethereum',
          toAddress: '0x0000000000000000000000000000000000000000',
          message: 'QNT test',
          options: {
            amount: 0,
            feeLimit: 100,
            feePrice: 1,
            sequence: 1,
          },
        },
      );

      expect(typeof ethereumSignedTransaction).toBe('string');
      expect(typeof rippleSignedTransaction).toBe('string');
    });

    test('Can send ripple & ethereum signedTransactions', async () => {
      mockedAxios.post.mockResolvedValue([
        { dlt: 'ripple', status: 'broadcasted', transactionHash: 'E8F7ED33E0FD8A06C33A00165508A556A958F2DC53AF4C5FC40FD93FA1A50693' },
        { dlt: 'ethereum', status: 'broadcasted', transactionHash: '0x712df767d7adea8a16aebbf080bc14daf21d3f00d3f95817db0b45abe7631711' },
      ]);

      const signedTransactions = [
        {
          dlt: 'ripple',
          fromAddress: rippleAccount.address,
          amount: 1,
          signedTransaction: {
            signatures: [],
            transactions: [rippleSignedTransaction]
          },
        },
        {
          dlt: 'ethereum',
          fromAddress: ethereumAccount.address,
          amount: 0,
          signedTransaction: {
            signatures: [],
            transactions: [ethereumSignedTransaction]
          },
        }
      ]
      await overledger.send(signedTransactions);

      expect(mockedAxios.post).toBeCalledWith('/transactions', {
        mappId: 'testmappid',
        dltData: [
          {
            dlt: 'ripple',
            fromAddress: expect.any(String),
            amount: expect.any(Number),
            signedTransaction: expect.any(Object),
          },
          {
            dlt: 'ethereum',
            fromAddress: expect.any(String),
            amount: expect.any(Number),
            signedTransaction: expect.any(Object),
          },
        ],
      });
    });
  });
});
