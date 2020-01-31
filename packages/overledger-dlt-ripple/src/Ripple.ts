import { RippleAPI } from 'ripple-lib';
import { dropsToXrp } from 'ripple-lib/dist/npm/common';
import { deriveKeypair, deriveAddress } from 'ripple-keypairs';
import AbstractDLT from '@quantnetwork/overledger-dlt-abstract';
import { Account, Options, TransactionRequest } from '@quantnetwork/overledger-types';
import { Payment } from 'ripple-lib/dist/npm/transaction/payment';
import { Instructions } from 'ripple-lib/dist/npm/transaction/types';
import TransactionXRPRequest from './DLTSpecificTypes/TransactionXRPRequest';

/**
 * @memberof module:overledger-dlt-ripple
*/
class Ripple extends AbstractDLT {
  rippleAPI: RippleAPI;
  account: Account;
  options: Object;
  /**
   * Name of the DLT
   */
  name: string = 'ripple';

  /**
   * Symbol of the DLT
   */
  symbol: string = 'XRP';

  /**
   * @param {any} sdk
   * @param {Object} options
   */
  // @TODO: add options statement
  constructor(sdk: any, options: Options = {}) {
    super(sdk, options);

    this.options = options;

    this.rippleAPI = new RippleAPI();

    if (options.privateKey) {
      this.setAccount(options.privateKey);
    }
  }

  /**
   * Create an account for a specific DLT
   *
   * @return {Account}
   */
  createAccount(): Account {
    const generated = this.rippleAPI.generateAddress();

    const account = {
      address: generated.address,
      privateKey: generated.secret,
    };

    return account;
  }

  /**
   * Set an account for signing for a specific DLT
   *
   * @param {string} privateKey The privateKey
   */
  setAccount(privateKey: string): void {
    const keypair = deriveKeypair(privateKey);
    const account = {
      privateKey,
      address: keypair.publicKey,
    };
    account.address = deriveAddress(keypair.publicKey);
    this.account = account;
  }

  /**
   * Build the transaction
   *
   * @param {string} toAddress
   * @param {string} message
   * @param {TransactionOptions} options
   */
  buildTransaction(thisTransaction: TransactionXRPRequest): Transaction {
    if (typeof thisTransaction.extraFields === 'undefined') {   
      throw new Error('Transaction options must be defined.');
    }

    if (typeof thisTransaction.amount === 'undefined') {
      throw new Error('A transaction.amount must be given');
    }

    if (typeof thisTransaction.extraFields.feePrice === 'undefined') {
      throw new Error('A transaction.extraFields.feePrice must be given');
    }

    if (typeof thisTransaction.sequence === 'undefined') {
      throw new Error('A transaction.sequence must be given');
    }

    if (typeof thisTransaction.extraFields.maxLedgerVersion === 'undefined') {
      throw new Error('A transactions.extraFields.maxLedgerVersion must be set up');
    }
    const maxLedgerVersion = Number(thisTransaction.extraFields.maxLedgerVersion);
    const amountInXRP = dropsToXrp(thisTransaction.amount.toString());
    const feeInXRP = dropsToXrp(thisTransaction.extraFields.feePrice);

    const address = this.account.address;
    const payment = {
      source: {
        address: this.account.address,
        amount: {
          value: amountInXRP,
          currency: 'XRP',
        },
      },
      destination: {
        address: thisTransaction.toAddress,
        minAmount: {
          value: amountInXRP,
          currency: 'XRP',
        },
      },
      memos: [{
        data: thisTransaction.message,
      }],
    };
    const instructions = {
      maxLedgerVersion,
      sequence: thisTransaction.sequence,
      fee: feeInXRP,
    };

    return { address, payment, instructions };
  }

  /**
   * Sign the transaction
   *
   * @param {string} toAddress
   * @param {string} message
   * @param {TransactionOptions} options
   */
  _sign(thisTransaction: TransactionRequest): Promise<string> {
    
    const built = this.buildTransaction(<TransactionXRPRequest>thisTransaction);

    return this.rippleAPI.preparePayment(built.address, built.payment, built.instructions)
      .then(
        prepared => this.rippleAPI.sign(prepared.txJSON, this.account.privateKey).signedTransaction,
      );
  }
}

export type Transaction = {
  address: string,
  payment: Payment,
  instructions?: Instructions,
};



export default Ripple;
