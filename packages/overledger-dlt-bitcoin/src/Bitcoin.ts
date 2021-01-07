import * as bitcoin from 'bitcoinjs-lib';
import { MAINNET } from '@quantnetwork/overledger-provider';
import AbstractDLT from '@quantnetwork/overledger-dlt-abstract';
import { Options, Account, TransactionRequest, ValidationCheck } from '@quantnetwork/overledger-types';
import TransactionBitcoinRequest from './DLTSpecificTypes/TransactionBitcoinRequest';
import TransactionBitcoinSubTypeOptions from './DLTSpecificTypes/associatedEnums/TransactionBitcoinSubTypeOptions';
import { AxiosInstance, AxiosPromise } from 'axios';
import TransactionBitcoinScriptTypeOptions from './DLTSpecificTypes/associatedEnums/TransactionBitcoinScriptTypeOptions';

/**
 * @memberof module:overledger-dlt-bitcoin
*/
class Bitcoin extends AbstractDLT {
  addressType: bitcoin.Network;
  request: AxiosInstance;
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
   * @param {any} sdk - the sdk instance
   * @param {Object} options - any additional options to instantiate this dlt
   */
  constructor(sdk: any, options: Options = {}) {
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

  getEstimateFeeRate(): AxiosPromise {
    try {
      this.request = this.sdk.provider.createRequest('/bitcoin');
      return this.request.get('/transactions/fee');
    } catch (e) {
      return e.response;
    }
  }

  /**
  * Takes the Overledger definition of a transaction and converts it into a specific Bitcoin transaction
  * @param {TransactionEthereumRequest} thisTransaction - details on the information to include in this transaction for the Bitcoin distributed ledger
  * @return {Transaction} the Bitcoin transaction
  */
  buildTransaction(thisTransaction: TransactionBitcoinRequest): any {

    super.transactionValidation(thisTransaction);

    // const feePrice = Number(thisTransaction.extraFields.feePrice);
    // console.log(`network ${JSON.stringify(this.addressType)}`);
    const NETWORK = bitcoin.networks.testnet;
    const psbtObj = new bitcoin.Psbt({ network: NETWORK }); // set maximum fee rate = 0 to be flexible on fee rate
    console.log(`psbtObj ${JSON.stringify(psbtObj)}`);
    psbtObj.setMaximumFeeRate(0);
    psbtObj.setVersion(2); // These are defaults. This line is not needed.
    psbtObj.setLocktime(0);
    // const data = Buffer.from(thisTransaction.message, 'utf8'); // Message is inserted
    let counter = 0;
    while (counter < thisTransaction.txInputs.length) {
      const rawTransactionInput = thisTransaction.txInputs[counter].rawTransaction.toString();
      const isSegwit = rawTransactionInput.substring(8, 12) === '0001';
      console.log(`isSegwit ${isSegwit}`);
      let input: UtxoInput = {
        hash: thisTransaction.txInputs[counter].linkedTx.toString(),
        index: parseInt(thisTransaction.txInputs[counter].linkedIndex, 10),
        nonWitnessUtxo: Buffer.from(rawTransactionInput.toString(), 'hex')
      };
      if (isSegwit) {
        input.witnessUtxo = {
          script: Buffer.from(thisTransaction.txInputs[counter].scriptPubKey.toString(), 'hex'),
          value: thisTransaction.txInputs[counter].amount
        };
      }
      if (thisTransaction.txInputs[counter].redeemScript !== undefined) {
        input.redeemScript = Buffer.from(thisTransaction.txInputs[counter].redeemScript.toString(), 'hex');
      } else if (thisTransaction.txInputs[counter].witnessScript !== undefined) {
        input.witnessScript = Buffer.from(thisTransaction.txInputs[counter].witnessScript.toString(), 'hex')
      };
      console.log(`input ${JSON.stringify(input)}`);
      psbtObj.addInput(input);
      counter = counter + 1;
    }

    counter = 0;
    while (counter < thisTransaction.txOutputs.length) {
      let output: UtxoOutput = {
        value: thisTransaction.txOutputs[counter].amount
      }
      if (thisTransaction.txOutputs[counter].scriptType === TransactionBitcoinScriptTypeOptions.P2SH) {
        output.script = Buffer.from(thisTransaction.txOutputs[counter].script, 'hex');
      } else if (thisTransaction.txOutputs[counter].scriptType === TransactionBitcoinScriptTypeOptions.P2PKH) {
        output.address = thisTransaction.txOutputs[counter].toAddress.toString();
      }
      console.log(`output ${output}`);
      psbtObj.addOutput(output);
      counter = counter + 1;
    }
    return psbtObj;
  }

  /**
  * validates an OVL transactionRequest according to XRP specific rules
  * @param thisTransaction - The transaction request
  */
  _transactionValidation(thisTransaction: TransactionRequest): ValidationCheck {

    const thisBitcoinTx = <TransactionBitcoinRequest>thisTransaction;

    if (!Object.values(TransactionBitcoinSubTypeOptions).includes(thisBitcoinTx.subType.name)) {
      return {
        success: false,
        failingField: 'subType',
        error: 'You must select a subType from TransactionSubTypeOptions',
      };
    }
    if ((!thisBitcoinTx.extraFields) || (thisBitcoinTx.extraFields === undefined)) {
      return {
        success: false,
        failingField: 'extraFields',
        error: 'All transactions for Bitcoin must have the extraFields field set with feePrice parameters within it',
      };
    }
    if ((thisBitcoinTx.extraFields.feePrice === '') || (thisBitcoinTx.extraFields.feePrice == null) || (thisBitcoinTx.extraFields.feePrice === undefined)) {
      return {
        success: false,
        failingField: 'extraFields.feePrice',
        error: 'All transactions for Bitcoin must have the extraFields.feePrice field set and it must be convertable to a number',
      };
    }
    // make sure an amount is in each txInput and txOutput
    let counter = 0;
    let totalInputAmount = 0;
    let totalOutputAmount = 0;
    while (counter < thisBitcoinTx.txInputs.length) {

      if (!thisBitcoinTx.txInputs[counter].amount || thisBitcoinTx.txInputs[counter].amount === undefined) {
        return {
          success: false,
          failingField: 'thisBitcoinTx.txInputs.amount',
          error: 'All transactions inputs for Bitcoin must have an amount field',
        };
      }
      totalInputAmount = totalInputAmount + thisBitcoinTx.txInputs[counter].amount;
      counter = counter + 1;
    }
    counter = 0;
    while (counter < thisBitcoinTx.txOutputs.length) {

      // if (!thisBitcoinTx.txOutputs[counter].amount || thisBitcoinTx.txOutputs[counter].amount === undefined) {
      if (thisBitcoinTx.txOutputs[counter].amount === undefined) {
        return {
          success: false,
          failingField: 'thisBitcoinTx.txOutputs.amount',
          error: 'All transactions outputs for Bitcoin must have an amount field',
        };
      }
      totalOutputAmount = totalOutputAmount + thisBitcoinTx.txOutputs[counter].amount;
      counter = counter + 1;
    }
    // make sure that the fee price + transaction amounts equal the input amount (minus dust??)
    // this way we can alert the user if he expected change to be given automatically!

    if (totalInputAmount - totalOutputAmount - parseInt(thisBitcoinTx.extraFields.feePrice, 10) !== 0) { // providing a bit of leway for javascript parsing errors
      return {
        success: false,
        failingField: 'amount',
        error: 'All transactions for Bitcoin must satisfy the following logic: TotalInputAmounts - TotalOutputAmounts - feePrice = 0',
      };
    }

    return { success: true };
  }

  /**
   * Takes in an overledger definition of a transaction for XRP, converts it into a form that the XRP distributed ledger will understand, and then signs the transaction
   * @param {TransactionRequest} thisTransaction - an instantiated overledger definition of an XRP transaction
   */
  _sign(thisTransaction: TransactionRequest): Promise<string> {

    const thisBitcoinTransaction = <TransactionBitcoinRequest>thisTransaction;
    let psbtObj = this.buildTransaction(thisBitcoinTransaction);
    // for each input sign them:
    const myKeyPair = bitcoin.ECPair.fromWIF(this.account.privateKey, this.addressType);
    console.log(`myKeyPair ${myKeyPair}`);
    let counter = 0;
    while (counter < thisBitcoinTransaction.txInputs.length) {
      // currently we are only supporting the p2pkh script
      // if not redeemScript or not witnessScript
      psbtObj.signInput(counter, myKeyPair);
      counter = counter + 1;
    }
    // psbt.finalizeInput in case of a redeem fund
    // A TO B FUND SMART CONTRACT
    psbtObj.validateSignaturesOfAllInputs();
    // psbt.finalizeAllInputs();

    console.log(`psbt object data ${JSON.stringify(psbtObj.data.inputs[0].partialSig[0].signature)}`);

    // A TO B REDEEM SMART CONTRACT
    psbtObj.finalizeInput(0, this.getFinalScripts);

    return Promise.resolve(psbtObj.extractTransaction(true).toHex());
  }

  getFinalScripts(inputIndex, input, script, isSegwit, isP2SH, isP2WSH, psbtObject) {
    // script is the locking script === scriptPubKey
    console.log(`getFinalScripts inputIndex: ${JSON.stringify(inputIndex)} input: ${input.toString('hex')} script: ${script} isSegwit: ${isSegwit} isP2SH: ${isP2SH} isP2WSH: ${isP2WSH}`);
    let finalizeRedeem;
    if (isP2SH) {
      // return finalScriptSig
      console.log(`isP2SH ${isP2SH}`);
      finalizeRedeem = bitcoin.payments.p2sh({
        redeem: {
          input: bitcoin.script.compile([
            input.partialSig[0].signature,
            // 'quantbitcoinpaymentchannel'
            ''
          ]),
          output: Buffer.from('a914c1678ba6b9cb17819bdca55c3d0e2aae4d4a97d9876321037475473e1e509bfd85dd7384d95dcb817b71f353b0e3d73616517747e98a26f16704b49b8c00b17521035b71e0ec7329c32acf0a86eaa62e88951818021c9ff893108ef5b3103db3222168ac', 'hex')
        }
      });
      return { finalScriptSig: finalizeRedeem.input };
    } else if (isP2WSH) {
      // return finalScriptWitness
      console.log(`isP2WSH ${isP2WSH}`);
      finalizeRedeem = bitcoin.payments.p2wsh({
        redeem: {
          input: bitcoin.script.compile([
            input.partialSig[0].signature,
            'quantbitcoinpaymentchannel'
          ]),
          output: Buffer.from('a914c1678ba6b9cb17819bdca55c3d0e2aae4d4a97d9876321037475473e1e509bfd85dd7384d95dcb817b71f353b0e3d73616517747e98a26f16704b49b8c00b17521035b71e0ec7329c32acf0a86eaa62e88951818021c9ff893108ef5b3103db3222168ac', 'hex')
        }
      });
      return { finalScriptWitness: psbtObject.witnessStackToScriptWitness(finalizeRedeem.witness) };

    } else {
      console.log(`isSTANDARD REDEEM PAYMENT`);
      return psbtObject.getFinalScripts(inputIndex, input, script, isSegwit, isP2SH, isP2WSH);
      // take the getFinalScripts defined in psbt library
      return true;
    }

  }

  /**
   * Create a Bitcoin account
   *
   * @return {Account} the new Bitcoin account
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
   * Set an account for signing transactions for a specific DLT
   *
   * @param {string} privateKey The privateKey
   */
  setAccount(myPrivateKey: string): void {

    const keyPair = bitcoin.ECPair.fromWIF(myPrivateKey, this.addressType);
    this.account = {
      privateKey: myPrivateKey,
      address: bitcoin.payments
        .p2pkh({ pubkey: keyPair.publicKey, network: this.addressType }).address,
    };

  }

  /**
  * Allows a user to build a smart contract query for the Bitcoin distributed ledger (currently not supported for Bitcoin)
  * @param {string} dltAddress - the user's Bitcoin address
  * @param {Object} contractQueryDetails - the definition of the smart contract function the user wants to interact with, including information on what parameters to use in the function call.
  *
  * @return {Object} success indicates if this query building was correct, if yes then it will be in the response field of the object
  */
  _buildSmartContractQuery(dltAddress: string, contractQueryDetails: Object): ValidationCheck {

    return {
      success: false,
      failingField: `${dltAddress} ${JSON.stringify(contractQueryDetails)}`,
      error: 'The Bitcoin SDK does not currently support smart contract queries',
    };
  }

  /**
  * validates an OVL smart contract query according to Bitcoin specific rules
  * @param contractQueryDetails - the query details
  *
  * @return {Object} success indicates if this query building was correct, if yes then it will be in the response field of the object
  */
  _smartContractQueryValidation(contractQueryDetails: Object): ValidationCheck {

    return {
      success: false,
      failingField: JSON.stringify(contractQueryDetails),
      error: 'The Bitcoin SDK does not currently support smart contract validation',
    };
  }
}

interface UtxoInput {
  hash: string;
  index: number;
  nonWitnessUtxo?: Buffer;
  witnessUtxo?: { script: Buffer, value: number };
  redeemScript?: Buffer;
  witnessScript?: Buffer;
};

interface UtxoOutput {
  value: number;
  address?: string;
  script?: Buffer;
}
export default Bitcoin;
