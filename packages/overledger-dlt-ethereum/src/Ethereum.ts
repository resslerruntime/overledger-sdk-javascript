import Accounts from 'web3-eth-accounts';
import Web3 from 'web3';
import { MAINNET } from '@quantnetwork/overledger-provider';
import AbstractDLT from '@quantnetwork/overledger-dlt-abstract';
import { Options, Account, TransactionOptions as BaseTransactionOptions } from '@quantnetwork/overledger-types';
import { DataMessageOptions } from '@quantnetwork/overledger-dlt-abstract/dist/AbstractDLT';

/**
 * @memberof module:overledger-dlt-ethereum
*/
class Ethereum extends AbstractDLT {
  chainId: number;
  account: Accounts;
  options: Object;
  web3: Web3;

  /**
   * Name of the DLT
   */
  name: string = 'ethereum';

  /**
   * Symbol of the DLT
   */
  symbol: string = 'ETH';

  /**
   * @param {any} sdk
   * @param {Object} options
   */
  // @TODO: add options statement
  constructor(sdk: any, options: Options = {}) {
    super(sdk, options);

    this.web3 = new Web3();
    this.options = options;

    if (options.privateKey) {
      this.setAccount(options.privateKey);
    }

    if (sdk.network === MAINNET) {
      this.chainId = 1;
    } else {
      this.chainId = 3;
    }
  }

  /**
   * Create an account for a specific DLT
   *
   * @return {Account}
   */
  createAccount(): Account {
    return this.web3.eth.accounts.create();
  }

  /**
   * Set an account for signing transactions for a specific DLT
   *
   * @param {string} privateKey The privateKey
   */
  setAccount(privateKey: string): void {
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
  }

  /**
   * Build the transaction
   *
   * @param {string} toAddress
   * @param {string} message
   * @param {TransactionOptions} options
   */
  buildTransaction(toAddress: string, message: string, options: TransactionOptions, dataMessageType?: DataMessageOptions): Transaction {
    console.log(`------------ build transaction ethereum ----------`);
    if (typeof options === 'undefined') {
      throw new Error('Transaction options must be defined.');
    }

    if (typeof options.amount === 'undefined') {
      throw new Error('options.amount must be set up');
    }

    if (typeof options.feeLimit === 'undefined') {
      throw new Error('options.feeLimit must be set up');
    }

    if (typeof options.feePrice === 'undefined') {
      throw new Error('options.feePrice must be set up');
    }

    if (typeof options.sequence === 'undefined') {
      throw new Error('options.sequence must be set up');
    }

    let transactionData = "";
    console.log(`dataMessageType`, dataMessageType);
    if (dataMessageType === DataMessageOptions.ascii) {
      if (DataMessageOptions.ascii.toString().localeCompare('ascii') === 0) {
        transactionData = this.web3.utils.asciiToHex(message);
      }
    } else if (dataMessageType === DataMessageOptions.smartContractCreation) {
      // check if toAddress empty
      transactionData = message;
    } else if (dataMessageType === DataMessageOptions.smartContractInvocation) {
      const invocationType = options.functionDetails.functionType;
      if (invocationType === FunctionTypes.constructorNoParams) {
        transactionData = message;
      } else if (invocationType === FunctionTypes.constructorWithParams) {
        const paramsList = options.functionDetails.functionParameters;
        transactionData = this.computeTransactionDataForConstructorWithParams(message, paramsList);
        console.log('constructor with params transaction data', transactionData);
      } else if (invocationType === FunctionTypes.functionCall) {
        const paramsList = options.functionDetails.functionParameters;
        const functionName = options.functionDetails.functionName;
        transactionData = this.computeTransactionDataForFunctionCall(functionName, paramsList);
        console.log('function call transaction data', transactionData);
      }
    }

    const transaction = {
      nonce: options.sequence,
      chainId: this.chainId,
      to: toAddress,
      gas: options.feeLimit,
      gasPrice: options.feePrice,
      value: options.amount,
      data: transactionData,
    };

    return transaction;
  }

  computeTransactionDataForConstructorWithParams(message: string, paramsList: [SmartContractParameter]): string {
    const typesAndValues = paramsList.reduce((paramsValues, p) => {
      const paramType = this.computeParamType(p);
      console.log(`computeTransactionDataForConstructorWithParams paramType `, paramType);
      paramsValues[0].push(paramType);
      paramsValues[1].push(p.value);
      return paramsValues;
    }, [[],[]]);
    console.log(`computeTransactionDataForConstructorWithParams typesAndValues `, typesAndValues);
    const encodedParams = this.web3.eth.abi.encodeParameters(typesAndValues[0], typesAndValues[1]).slice(2);
    console.log(`computeTransactionDataForConstructorWithParams encodedParams `, encodedParams);
    return message + encodedParams;
  }

  computeTransactionDataForFunctionCall(functionName: string, paramsList: [SmartContractParameter]): string {
    const inputsAndValues = paramsList.reduce((paramsValues, p) => {
      const paramType = this.computeParamType(p);
      paramsValues[0].push({ type: paramType.toString(), name: p.name });
      paramsValues[1].push(p.value);
      return paramsValues;
    }, [[],[]]);

    const jsonFunctionCall: IJsonFunctionCall = {
      name: functionName,
      type: 'function',
      inputs: <[{ type: string, name: string }]>inputsAndValues[0]
    }
    console.log(`computeTransactionDataForFunctionCall jsonFunctionCall `, jsonFunctionCall);
    console.log(`computeTransactionDataForFunctionCall inputsAndValues  `, inputsAndValues);
    const encodedInput = this.web3.eth.abi.encodeFunctionCall(jsonFunctionCall, inputsAndValues[1]);
    console.log(`computeTransactionDataForFunctionCall encodedInput `, encodedInput);
    // message contract byte code to add ? NOT NEEDED FOR FUNCTION CALL
    return encodedInput;
  }

  computeParamType(param: SmartContractParameter): string {
    let paramType = param.type.toString();
    if (paramType === (TypeOptions.bytesM || TypeOptions.bytesMArray)) {
      paramType = (param.bytesMValue === '1') ? paramType.replace('M', '') : paramType.replace('M', param.bytesMValue);
    } else if (param.type === (TypeOptions.uintM || TypeOptions.intM || TypeOptions.intMArray || TypeOptions.uintMArray)) {
      paramType = paramType.replace('M',param.uintIntMValue);
    }
    return paramType.replace('Array', '[]');
  }

  /**
   * Sign the transaction
   *
   * @param {string} toAddress
   * @param {string} message
   * @param {TransactionOptions} options
   */
  _sign(toAddress: string, message: string, options: TransactionOptions, dataMessageType?: DataMessageOptions): Promise<string> {
    console.log(`data type _sign`, dataMessageType);
    const transaction = this.buildTransaction(toAddress, message, options, dataMessageType);

    return new Promise((resolve, reject) => {
      this.account.signTransaction(transaction, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data.rawTransaction);
      });
    });
  }
}

export type Transaction = {
  nonce: number,
  chainId: number,
  to: string,
  gas: string,
  gasPrice: string,
  value: string,
  data: string,
};

interface TransactionOptions extends BaseTransactionOptions {
  feePrice: string;
  feeLimit: string;
  functionDetails?: FunctionOptions;
}

interface FunctionOptions {
  functionType: FunctionTypes;
  functionName?: string;
  payable: Payable;
  functionParameters?: [SmartContractParameter];
}

export enum Payable {
  payable = "true",
  notPayable = "false"
};

export enum FunctionTypes {
  constructorNoParams = "CONSTRUCTOR_NO_PARAMS",
  constructorWithParams = "CONSTRUCTOR_WITH_PARAMS",
  functionCall = "FUNCTION_CALL"
};

interface SmartContractParameter {
  type: TypeOptions;
  value: string;
  uintIntMValue?: UintIntMOptions;
  bytesMValue?: BytesMOptions;
  name?: string;
}

interface IJsonFunctionCall {
  name: string;
  type?: string;
  inputs: [{ type: string, name: string }];
}

export enum TypeOptions { uintM = "uintM", intM = "intM", address = "address", bool = "bool", bytesM = "bytesM", string = "string", uintMArray = "uintMArray", intMArray = "intMArray", addressArray = "addressArray", boolArray = "boolArray", bytesMArray = "bytesMArray" };
export enum UintIntMOptions { m8 = "8", m16 = "16", m32 = "32", m40 = "40", m48 = "48", m56 = "56", m64 = "64", m72 = "72", m80 = "80", m88 = "88", m96 = "96", m140 = "104", m112 = "112", m120 = "120", m128 = "128", m136 = "136", m144 = "144", m152 = "152", m160 = "160", m168 = "168", m176 = "176", m184 = "184", m192 = "192", m200 = "200", m208 = "208", m216 = "216", m224 = "224", m232 = "232", m240 = "240", m248 = "248", m256 = "256" };
export enum BytesMOptions { m1 = "1", m2 = "2", m3 = "3", m4 = "4", m5 = "5", m6 = "6", m7 = "7", m8 = "8", m9 = "9", m10 = "10", m11 = "11", m12 = "12", m13 = "13", m14 = "14", m15 = "15", m16 = "16", m17 = "17", m18 = "18", m19 = "19", m20 = "20", m21 = "21", m22 = "22", m23 = "23", m24 = "24", m25 = "25", m26 = "26", m27 = "27", m28 = "28", m29 = "29", m30 = "30", m31 = "31", m32 = "32" };

export default Ethereum;


// const sign = wweb3.eth.abi.encodeFunctionSignature('setVariable1(address)');
// const sign4 = wweb3.eth.abi.encodeFunctionSignature({name: 'setVariable1', type: 'function', inputs: [{type: 'address', name: 'newAddress'}]});
// '0xe2231a0c'