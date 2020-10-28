import axios from 'axios';
import OverledgerSDK from '../src';
const DltNameOptions = require('@quantnetwork/overledger-types').DltNameOptions;
const TransactionTypeOptions = require('@quantnetwork/overledger-types').TransactionTypeOptions;
const TransactionEthereumSubTypeOptions = require('@quantnetwork/overledger-dlt-ethereum').TransactionEthereumSubTypeOptions;
const TransactionXRPSubTypeOptions = require('@quantnetwork/overledger-dlt-ripple').TransactionXRPSubTypeOptions;

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Dlt/RippleAndEthereum', () => {
  describe('Main read functions', () => {
    test('Can getSequences for specific addresses', async () => {
      const overledger = new OverledgerSDK('testmappid', 'testbpikey', {
        dlts: [{ dlt: DltNameOptions.ETHEREUM, }, { dlt: DltNameOptions.XRP_LEDGER, },],
      });

      mockedAxios.post.mockResolvedValue({
        dltData: [
          {
            sequence: 0,
            dlt: DltNameOptions.ETHEREUM,
          },
          {
            sequence: 1,
            dlt: DltNameOptions.XRP_LEDGER,
          },
        ],
      } as any);

      const params = [
        {
          dlt: DltNameOptions.ETHEREUM,
          address: '0xA72a14Cdca45D51326d394B2ddAFb408270Ae101',
        },
        {
          dlt: DltNameOptions.XRP_LEDGER,
          address: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
        },
      ];

      await overledger.getSequences(params);

      expect(mockedAxios.post).toBeCalledWith('/sequence', {
        dltData: [
          {
            dlt: DltNameOptions.ETHEREUM,
            address: expect.any(String),
          },
          {
            dlt: DltNameOptions.XRP_LEDGER,
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
            dlt: DltNameOptions.XRP_LEDGER,
          },
          {
            dlt: DltNameOptions.ETHEREUM,
          },
        ],
      });

      mockedAxios.post.mockResolvedValue([
        {
          dltData: [
            {
              sequence: 1,
              dlt: DltNameOptions.ETHEREUM,
            },
          ],
        },
      ] as any);

      await overledger.dlts.ethereum.getSequence(ethAddress);

      expect(mockedAxios.post).toBeCalledWith('/sequence', {
        dltData: [
          {
            dlt: DltNameOptions.ETHEREUM,
            address: expect.any(String),
          },
        ],
      });
    });

    test('Can read transactions from mappId', async () => {
      const overledger = new OverledgerSDK('testmappid', 'testbpikey', {
        dlts: [{ dlt: DltNameOptions.XRP_LEDGER, }, { dlt: DltNameOptions.ETHEREUM, },],
      });

      mockedAxios.get.mockResolvedValue([
        {
          mappId: 'mappTestId',
          overledgerTransactionId: 'c2559f8d-d181-4ba3-9012-a47d6b6c6111',
          timestamp: '2018-09-07T10:29:50.695Z',
          dltData: [
            {
              dlt: DltNameOptions.ETHEREUM,
              transactionHash: '0xa3f8277dd54f1341dec3dfae3ad844ad8a226faa511e05b7dfe1e9de55481111',
              status: 'broadcasted',
              errorReason: null,
              links: [],
            },
          ],
        },
      ] as any);

      await overledger.readTransactionsByMappId();

      expect(mockedAxios.get).toBeCalledWith('/transactions/mappid/testmappid');
    });

    test('Can read transactions by overledger transaction id', async () => {
      const overledger = new OverledgerSDK('testmappid', 'testbpikey', {
        dlts: [{ dlt: DltNameOptions.XRP_LEDGER, }, { dlt: DltNameOptions.ETHEREUM, },],
      });

      mockedAxios.get.mockResolvedValue({
        mappId: 'mappTestId',
        overledgerTransactionId: '70cb4832-bbd0-400f-a6d8-2add51deb111',
        timestamp: '2018-09-07T23:36:49.832Z',
        dltData: [
          {
            dlt: DltNameOptions.ETHEREUM,
            transactionHash: '0x712df767d7adea8a16aebbf080bc14daf21d3f00d3f95817db0b45abe7631111',
            status: 'broadcasted',
            errorReason: null,
            links: [],
          },
        ],
      } as any);

      const transactionId = '70cb4832-bbd0-400f-a6d8-2add51deb111';
      await overledger.readOverledgerTransaction(transactionId);

      expect(mockedAxios.get).toBeCalledWith(`/transactions/id/${transactionId}`);
    });
  });

  describe('Using Ethereum and Ripple without injecting the privatekey in the DLT array', () => {
    let overledger;
    let ethereumAccount;
    let rippleAccount;
    let signedTransactions

    test('Load Ethereum and Ripple DLTs', async () => {
      overledger = new OverledgerSDK('testmappid', 'testbpikey', {
        dlts: [{ dlt: DltNameOptions.ETHEREUM, }, { dlt: DltNameOptions.XRP_LEDGER, },],
      });

      expect(overledger.dlts.ethereum).toBeDefined();
      expect(overledger.dlts.ripple).toBeDefined();
    });

    test('Can generate and set account for ethereum & ripple', async () => {
      rippleAccount = overledger.dlts.ripple.createAccount();
      ethereumAccount = overledger.dlts.ethereum.createAccount();

      overledger.dlts.ripple.setAccount({privateKey: rippleAccount.privateKey});
      overledger.dlts.ethereum.setAccount({privateKey: ethereumAccount.privateKey});

      expect(overledger.dlts.ripple.account.privateKey).toBe(rippleAccount.privateKey);
      expect(overledger.dlts.ethereum.account.privateKey).toBe(ethereumAccount.privateKey);
    });

    test('Can sign Ethereum and Ripple transactions', async () => {
      signedTransactions = await overledger.sign([
        {
          dlt: DltNameOptions.ETHEREUM,
          type: TransactionTypeOptions.ACCOUNTS,
          subType: {name: TransactionEthereumSubTypeOptions.VALUE_TRANSFER},
          message: "",
          fromAddress: '0xA72a14Cdca45D51326d394B2ddAFb408270Ae101',
          toAddress: '0x0000000000000000000000000000000000000000',
          sequence: 1, 
          amount: '0', 
          extraFields: {
            compUnitPrice: '8000000000', 
            compLimit: '80000'
          },
        },
        {
          dlt: DltNameOptions.XRP_LEDGER,
          type: TransactionTypeOptions.ACCOUNTS,
          subType: {name: TransactionXRPSubTypeOptions.VALUE_TRANSFER},
          message: "",
          fromAddress: "rHb9CJAWyB4rj91VRWn96DkukG4bwd1111",
          toAddress: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
          sequence: 1, 
          amount: '1',     
          extraFields: {
            feePrice: '12', 
            maxLedgerVersion: '4294967295'
          },
        }
      ]);

      expect(signedTransactions).toEqual([
        {
          dlt: DltNameOptions.ETHEREUM,
          fromAddress: expect.any(String),
          signedTransaction: {
            signatures: [expect.any(String)],
            transactions: [expect.any(String)],
          }
        },
        {
          dlt: DltNameOptions.XRP_LEDGER,
          fromAddress: expect.any(String),
          signedTransaction: {
            signatures: [expect.any(String)],
            transactions: [expect.any(String)],
          }
        },
      ]);
    });

    test('Can send Ethereum and Ripple signedTransactions', async () => {
      mockedAxios.post.mockResolvedValue([
        { dlt: DltNameOptions.ETHEREUM, status: 'broadcasted', transactionHash: '0x712df767d7adea8a16aebbf080bc14daf21d3f00d3f95817db0b45abe7631711' },
        { dlt: DltNameOptions.XRP_LEDGER, status: 'broadcasted', transactionHash: '716b436d084fa8a23cc623411f84bdb581036a79f9519eefb36754c5e6fe1111' },
      ] as any );

      await overledger.send(signedTransactions);

      expect(mockedAxios.post).toBeCalledWith('/transactions', {
        mappId: 'testmappid',
        dltData:
          [
            {
              dlt: DltNameOptions.ETHEREUM,
              fromAddress: expect.any(String),
              signedTransaction: {
                signatures: [expect.any(String)],
                transactions: [expect.any(String)],
              }
            },
            {
              dlt: DltNameOptions.XRP_LEDGER,
              fromAddress: expect.any(String),
              signedTransaction: {
                signatures: [expect.any(String)],
                transactions: [expect.any(String)],
              }
            },
          ],
      });
    });
  });

  describe('Using Ethereum and Ripple with injecting the privatekey in the DLT array', () => {
    let overledger;
    let ethereumAccount;
    let rippleAccount;
    let signedTransactions;

    test('Load Ethereum and Ripple DLTs', async () => {
      overledger = new OverledgerSDK('testmappid', 'testbpikey', {
        dlts: [
          { dlt: DltNameOptions.ETHEREUM, privateKey: '0xe58af4f4a4a509b0190d87bdcd6d05ec4c274cfdd2282f4d196da6466d56c621', },
          { dlt: DltNameOptions.XRP_LEDGER, privateKey: 'shL8VmeBqoB7CnbPjXmfue7zeBeeg', },
        ],
      });

      expect(overledger.dlts.ethereum).toBeDefined();
      expect(overledger.dlts.ripple).toBeDefined();
    });

    test('Can generate and set the accounts for Ethereum & Ripple', async () => {
      ethereumAccount = overledger.dlts.ethereum.createAccount();
      rippleAccount = overledger.dlts.ripple.createAccount();


      overledger.dlts.ethereum.setAccount({privateKey: ethereumAccount.privateKey});
      overledger.dlts.ripple.setAccount({privateKey: rippleAccount.privateKey});


      expect(overledger.dlts.ethereum.account.privateKey).toBe(ethereumAccount.privateKey);
      expect(overledger.dlts.ripple.account.privateKey).toBe(rippleAccount.privateKey);
    });

    test('Can sign Ethereum and Ripple transactions', async () => {
      signedTransactions = await overledger.sign([
        {
          dlt: DltNameOptions.ETHEREUM,
          type: TransactionTypeOptions.ACCOUNTS,
          subType: {name: TransactionEthereumSubTypeOptions.VALUE_TRANSFER},
          message: "",
          fromAddress: '0xA72a14Cdca45D51326d394B2ddAFb408270Ae101', //should really be the  address of the private key but for this test is does not matter
          toAddress: '0x0000000000000000000000000000000000000000',
          sequence: 1, 
          amount: '0', 
          extraFields: {
            compUnitPrice: '8000000000', 
            compLimit: '80000'
          },
        },
        {
          dlt: DltNameOptions.XRP_LEDGER,
          type: TransactionTypeOptions.ACCOUNTS,
          subType: {name: TransactionXRPSubTypeOptions.VALUE_TRANSFER},
          message: "",
          fromAddress: "rHb9CJAWyB4rj91VRWn96DkukG4bwd1111", //should really be the  address of the private key but for this test is does not matter
          toAddress: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
          sequence: 1, 
          amount: '1',     
          extraFields: {
            feePrice: '12', 
            maxLedgerVersion: '4294967295'
          },
        }
      ]);

      expect(signedTransactions).toEqual([
        {
          dlt: DltNameOptions.ETHEREUM,
          fromAddress: expect.any(String),
          signedTransaction: {
            signatures: [expect.any(String)],
            transactions: [expect.any(String)],
          }
        },
        {
          dlt: DltNameOptions.XRP_LEDGER,
          fromAddress: expect.any(String),
          signedTransaction: {
            signatures: [expect.any(String)],
            transactions: [expect.any(String)],
          }
        },
      ]);
    });

    test('Can send ripple & ethereum signedTransactions', async () => {
      mockedAxios.post.mockResolvedValue([
        { dlt: DltNameOptions.XRP_LEDGER, status: 'broadcasted', transactionHash: 'E8F7ED33E0FD8A06C33A00165508A556A958F2DC53AF4C5FC40FD93FA1A50693' },
        { dlt: DltNameOptions.ETHEREUM, status: 'broadcasted', transactionHash: '0x712df767d7adea8a16aebbf080bc14daf21d3f00d3f95817db0b45abe7631711' },
      ] as any);

      await overledger.send(signedTransactions);

      expect(mockedAxios.post).toBeCalledWith('/transactions', {
        mappId: 'testmappid',
        dltData: [
          {
            dlt: DltNameOptions.ETHEREUM,
            fromAddress: expect.any(String),
            signedTransaction: {
              signatures: [expect.any(String)],
              transactions: [expect.any(String)],
            }
          },
          {
            dlt: DltNameOptions.XRP_LEDGER,
            fromAddress: expect.any(String),
            signedTransaction: {
              signatures: [expect.any(String)],
              transactions: [expect.any(String)],
            }
          },
        ],
      });
    });
  });
});
