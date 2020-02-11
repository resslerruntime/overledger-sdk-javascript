import bitcoin from 'bitcoinjs-lib';
import { MAINNET } from '@quantnetwork/overledger-provider';
import AbstractDLT from '@quantnetwork/overledger-dlt-abstract';
import { Options, Account, TransactionRequest, ValidationCheck} from '@quantnetwork/overledger-types';
import TransactionBitcoinRequest from './DLTSpecificTypes/TransactionBitcoinRequest';
import TransactionBitcoinSubTypeOptions from "./DLTSpecificTypes/associatedEnums/TransactionBitcoinSubTypeOptions";


class Bitcoin extends AbstractDLT {
  NON_DUST_AMOUNT: number = 546;
  addressType: string;
  privateKey: string;
  account: Account;
  options: Object;

  /**
   * Name of the DLT
   */
  name: string = 'bitcoin';

  /**
   * Symbol of the DLT
   */
  symbol: string = 'XBT';

  /**
   * @inheritdoc
   */
  constructor(sdk: any, options: Options) {
    super(sdk, options);

    if (sdk.network === MAINNET) {
      this.addressType = bitcoin.networks.bitcoin;
    } else {
      this.addressType = bitcoin.networks.testnet;
    }

    if (options.privateKey) {
      this.setAccount(options.privateKey);
    }
  }

  /**
   * Takes the Overledger definition of a transaction and converts it into a specific Bitcoin transaction
   * @param {TransactionEthereumRequest} thisTransaction - details on the information to include in this transaction for the Bitcoin distributed ledger
   * @return {Transaction} the Bitcoin transaction
   */
  buildTransaction(thisTransaction: TransactionBitcoinRequest): any {
    console.log("0");
    super.transactionValidation(thisTransaction);

    //const feePrice = Number(thisTransaction.extraFields.feePrice);
    console.log("1");
    const tx = new bitcoin.TransactionBuilder(this.addressType);
    const data = Buffer.from(thisTransaction.message, 'utf8'); // Message is inserted
    console.log("2");
    let counter = 0;
    while (counter < thisTransaction.txInputs.length){
      tx.addInput(thisTransaction.txInputs[counter].linkedTx, thisTransaction.txInputs[counter].linkedIndex);
      counter++;
    }
    console.log("3");
    counter = 0;
    while (counter < thisTransaction.txOutputs.length){
      tx.addOutput(thisTransaction.txOutputs[counter].toAddress, thisTransaction.txOutputs[counter].amount);
      counter++;
    }
    console.log("4");
    const ret = bitcoin.script.compile(
      [
        bitcoin.opcodes.OP_RETURN,
        data,
      ]);
      console.log("5");
    tx.addOutput(ret, 0);
    console.log("6");
    //tx.addOutput(this.account.address, value - amount - this.NON_DUST_AMOUNT - feePrice);

    return tx;
  }

    /**
   * validates an OVL transactionRequest according to XRP specific rules
   * @param thisTransaction - The transaction request
   */
_transactionValidation(thisTransaction: TransactionRequest): ValidationCheck {

  let thisBitcoinTx = <TransactionBitcoinRequest> thisTransaction;

if (!Object.values(TransactionBitcoinSubTypeOptions).includes(thisBitcoinTx.subType.name)) {
  return {
    success: false,
    failingField: "subType",
    error: "You must select a subType from TransactionSubTypeOptions"
  }
} else if ((!thisBitcoinTx.extraFields)||(thisBitcoinTx.extraFields == null)){
    return {
      success: false,
      failingField: "extraFields",
      error: 'All transactions for Bitcoin must have the extraFields field set with feePrice parameters within it'
    } 
  } else if ((!thisBitcoinTx.extraFields)||(thisBitcoinTx.extraFields == null)){
    return {
      success: false,
      failingField: "extraFields",
      error: 'All transactions for Bitcoin must have the extraFields field set with feePrice parameters within it'
    } 
  } else if ((thisBitcoinTx.extraFields.feePrice == "")||(thisBitcoinTx.extraFields.feePrice == null)||(thisBitcoinTx.extraFields.feePrice === 'undefined')){
    return {
      success: false,
      failingField: "extraFields.feePrice",
      error: 'All transactions for Bitcoin must have the extraFields.feePrice field set and it must be convertable to a number'
    }     
  }
  //make sure an amount is in each txInput and txOutput
  let counter = 0;
  let totalInputAmount = 0;
  let totalOutputAmount = 0;
  while (counter < thisBitcoinTx.txInputs.length){
    
    if ((!thisBitcoinTx.txInputs[counter].amount)||(thisBitcoinTx.txInputs[counter].amount == null)){
      return {
        success: false,
        failingField: "thisBitcoinTx.txInputs[counter].amount",
        error: 'All transactions inputs for Bitcoin must have an amount field'
      } 
    }
    totalInputAmount = totalInputAmount + thisBitcoinTx.txInputs[counter].amount;
    counter++;
  }
  counter = 0;
  while (counter < thisBitcoinTx.txOutputs.length){
    
    if ((!thisBitcoinTx.txOutputs[counter].amount)||(thisBitcoinTx.txOutputs[counter].amount == null)){
      return {
        success: false,
        failingField: "thisBitcoinTx.txOutputs[counter].amount",
        error: 'All transactions outputs for Bitcoin must have an amount field'
      } 
    }
    totalOutputAmount = totalOutputAmount + thisBitcoinTx.txOutputs[counter].amount;
    counter++;
  }
  //make sure that the fee price + transaction amounts equal the input amount (minus dust??)
  //this way we can alert the user if he expected change to be given automatically!

  if (Number(totalInputAmount)-Number(totalOutputAmount)-Number(thisBitcoinTx.extraFields.feePrice) != 0){
    console.log("A: " + totalInputAmount); 
    console.log("B: " + totalOutputAmount); 
    console.log("C: " + thisBitcoinTx.extraFields.feePrice); 
    console.log("D: " + (Number(totalInputAmount)-Number(totalOutputAmount)-Number(thisBitcoinTx.extraFields.feePrice))); 
    return {
      success: false,
      failingField: "amount",
      error: 'All transactions for Bitcoin must satisfy the following logic: TotalInputAmounts - TotalOutputAmounts - feePrice = 0'
    } 
  }

  return {success: true};
}

  /**
   * Takes in an overledger definition of a transaction for XRP, converts it into a form that the XRP distributed ledger will understand, and then signs the transaction
   * @param {TransactionRequest} thisTransaction - an instantiated overledger definition of an XRP transaction
   */
  _sign(thisTransaction: TransactionRequest): Promise<string> {
    
    const transaction = this.buildTransaction(<TransactionBitcoinRequest>thisTransaction);
    transaction.sign(0, this.account.privateKey);

    return Promise.resolve(transaction.build().toHex());
  }

  /**
   * @inheritdoc
   */
  createAccount(): Account {
    const keyPair = bitcoin.ECPair.makeRandom({ network: this.addressType });

    const privateKey = keyPair.toWIF();
    const { address } = bitcoin.payments
      .p2pkh({ pubkey: keyPair.publicKey, network: this.addressType });

    return {
      privateKey,
      address,
    };
  }

  /**
   * @inheritdoc
   */
  setAccount(privateKey: string): void {
    const keyPair = bitcoin.ECPair.fromWIF(privateKey, this.addressType);

    this.account = {
      privateKey: keyPair,
      address: bitcoin.payments
        .p2pkh({ pubkey: keyPair.publicKey, network: this.addressType }).address,
    };
  }

    /**
   * Allows a user to build a smart contract query for the Bitcoin distributed ledger (currently not supported for XRP)
   * @param {string} dltAddress - the user's Bitcoin address
   * @param {Object} contractQueryDetails - the definition of the smart contract function the user wants to interact with, including information on what parameters to use in the function call.
   *
   * @return {Object} success indicates if this query building was correct, if yes then it will be in the response field of the object
   */
  _buildSmartContractQuery(dltAddress: string, contractQueryDetails: Object): ValidationCheck {

    return {
      success: false,
      failingField: dltAddress + " " + JSON.stringify(contractQueryDetails),
      error: "The Bitcoin SDK does not currently support smart contract queries",
    }
  }

    /**
   * validates an OVL smart contract query according to Bitcoin specific rules
   * @param contractQueryDetails - the query details
   * 
   * @return {Object} success indicates if this query building was correct, if yes then it will be in the response field of the object
   */
  _smartContractQueryValidation(contractQueryDetails: Object): ValidationCheck{
    
    return {
      success: false,
      failingField: JSON.stringify(contractQueryDetails),
      error: "The Bitcoin SDK does not currently support smart contract validation"
    }
  }
}

export default Bitcoin;