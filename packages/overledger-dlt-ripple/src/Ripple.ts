import { RippleAPI } from 'ripple-lib';
import { dropsToXrp } from 'ripple-lib/dist/npm/common';
import { deriveKeypair, deriveAddress } from 'ripple-keypairs';
import AbstractDLT from '@quantnetwork/overledger-dlt-abstract';
import { Account, Options, TransactionRequest, TransactionValidationCheck } from '@quantnetwork/overledger-types';
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
   * Takes the Overledger definition of a transaction and converts it into a specific XRP transaction
   * @param {TransactionXRPRequest} thisTransaction - details on the information to include in this transaction for the XRP distributed ledger
   * @return {Transaction} the XRP transaction
   */
  buildTransaction(thisTransaction: TransactionXRPRequest): Transaction {

    super.transactionValidation(thisTransaction);

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

_transactionValidation(thisTransaction: TransactionRequest): TransactionValidationCheck {

  let thisXRPTx = <TransactionXRPRequest> thisTransaction;
  //check for the presence of XRP specific fields
  if ((!thisXRPTx.extraFields)||(thisXRPTx.extraFields == null)){
    return {
      success: false,
      failingField: "extraFields",
      error: 'All transactions for XRP must have the extraFields field set with feePrice and maxLedgerVersion parameters within it'
    } 
  } else if ((thisXRPTx.extraFields.feePrice == "")||(thisXRPTx.extraFields.feePrice == null)||(thisXRPTx.extraFields.feePrice === 'undefined')){
    return {
      success: false,
      failingField: "extraFields.feePrice",
      error: 'All transactions for XRP must have the extraFields.feePrice field set'
    }    
  } else if ((thisXRPTx.extraFields.maxLedgerVersion == "")||(thisXRPTx.extraFields.maxLedgerVersion == null)||(thisXRPTx.extraFields.maxLedgerVersion === 'undefined')){
    return {
      success: false,
      failingField: "extraFields.maxLedgerVersion",
      error: 'All transactions for XRP must have the extraFields.maxLedgerVersion field set'
    } 
  }

  //there must be a to address
  if (thisXRPTx.toAddress == ""){
    return {
      success: false,
      failingField: "toAddress",
      error: 'All transactions for XRP must have the toAddress field set to an address'
    }       
  }
  //sequence number must start at 1
  if (thisXRPTx.sequence <= 0){
    return {
      success: false,
      failingField: "sequence",
      error: 'All transactions for XRP must have a sequence number greater than 0'
    }      
  }

  if ((typeof thisXRPTx.amount === 'undefined')||(thisXRPTx.amount <= 0)) {
    return {
      success: false,
      failingField: "amount",
      error: 'A transactions for XRP must have an amount > 0'
    }    
  }

  return {success: true};
}


  /**
   * Takes in an overledger definition of a transaction for XRP, converts it into a form that the XRP distributed ledger will understand, and then signs the transaction
   * @param {TransactionRequest} thisTransaction - an instantiated overledger definition of an XRP transaction
   */
  _sign(thisTransaction: TransactionRequest): Promise<string> {
    
    const built = this.buildTransaction(<TransactionXRPRequest> thisTransaction);

    return this.rippleAPI.preparePayment(built.address, built.payment, built.instructions)
      .then(
        prepared => this.rippleAPI.sign(prepared.txJSON, this.account.privateKey).signedTransaction,
      );
  }

  /**
   * Allows a user to build a smart contract query for the XRP distributed ledger (currently not supported for XRP)
   * @param {string} dltAddress - the user's XRP address
   * @param {Object} contractQueryDetails - the definition of the smart contract function the user wants to interact with, including information on what parameters to use in the function call.
   *
   * @return {Object} success indicates if this query building was correct, if yes then it will be in the response field of the object
   */
  buildSmartContractQuery(dltAddress: string, contractQueryDetails: Object): Object {

    return {success: false, response: dltAddress.toString() + contractQueryDetails.toString()};
  }

}

export type Transaction = {
  address: string,
  payment: Payment,
  instructions?: Instructions,
};



export default Ripple;
