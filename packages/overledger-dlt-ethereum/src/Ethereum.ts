import Accounts from 'web3-eth-accounts';
import Web3 from 'web3';
import { MAINNET } from '@quantnetwork/overledger-provider';
import AbstractDLT from '@quantnetwork/overledger-dlt-abstract';
import { Options, Account, TransactionOptions as BaseTransactionOptions, TypeOptions, BytesMOptions, UintIntMOptions } from '@quantnetwork/overledger-types';
import { DataMessageOptions } from '@quantnetwork/overledger-dlt-abstract/dist/AbstractDLT';
import { computeParamType } from '@quantnetwork/overledger-types';

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

    if (!toAddress && dataMessageType === DataMessageOptions.smartContractInvocation) {
      throw new Error('The toAddress must be defined for smart contract invocation');
    }

    if (parseInt(options.amount, 10) > 0
      && (dataMessageType === DataMessageOptions.smartContractCreation || dataMessageType === DataMessageOptions.smartContractInvocation)
      && options.functionDetails.payable === "false") {
      throw new Error('the amount must be equal to zero for smart contract creation/invocation when non payable');
    }

    let transactionData = "";
    let invocationType = options.functionDetails.functionType;
    if (dataMessageType === DataMessageOptions.ascii) {
      if (DataMessageOptions.ascii.toString().localeCompare('ascii') === 0) {
        transactionData = this.web3.utils.asciiToHex(message);
      }
    } else if (dataMessageType === DataMessageOptions.smartContractCreation) {
      if (!toAddress) {
        invocationType = options.functionDetails.functionType;
        if (invocationType === FunctionTypes.constructorNoParams) {
          transactionData = message;
        } else if (invocationType === FunctionTypes.constructorWithParams) {
          const paramsList: [SmartContractParameter] = options.functionDetails.functionParameters;
          if (!paramsList || paramsList.length <= 0) {
            throw new Error(`functionParameters must be defined with a non-null length in the functionDetails`);
          }
          transactionData = this.computeTransactionDataForConstructorWithParams(message, paramsList);
        } else {
          throw new Error(`The function type must be constructorNoParams or constructorWithParams`);
        }
      } else {
        throw new Error('The toAddress must be undefined for smart contract creation');
      }
    } else if (dataMessageType === DataMessageOptions.smartContractInvocation) {
      invocationType = options.functionDetails.functionType;
      if (toAddress) {
        if (invocationType === FunctionTypes.functionCall) {
          const paramsList: [SmartContractParameter] = options.functionDetails.functionParameters;
          if (!paramsList) {
            throw new Error(`functionParameters must be defined in the functionDetails; at least with an emty array []`);
          }
          const functionName = options.functionDetails.functionName;
          if (!functionName) {
            throw new Error(`The name of the called function must be given for smart contract invocation`);
          }
          transactionData = this.computeTransactionDataForFunctionCall(functionName, paramsList);
          console.log('function call transaction data', transactionData);
        }
        else {
          throw new Error(`The function type must be functionCall`);
        }
      } else {
        throw new Error('The toAddress of the contract must be given');
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
    console.log(`transaction `, transaction);
    return transaction;
  }

  computeTransactionDataForConstructorWithParams(message: string, paramsList: [SmartContractParameter]): string {
    const typesAndValues = paramsList.reduce((paramsValues, p) => {
      const paramType = computeParamType(p);
      console.log(`computeTransactionDataForConstructorWithParams paramType `, paramType);
      paramsValues[0].push(paramType);
      paramsValues[1].push(p.value);
      return paramsValues;
    }, [[], []]);
    const encodedParams = this.web3.eth.abi.encodeParameters(typesAndValues[0], typesAndValues[1]).slice(2);
    return message + encodedParams;
  }

  computeTransactionDataForFunctionCall(functionName: string, paramsList: [SmartContractParameter]): string {
    const inputsAndValues = paramsList.reduce((paramsValues, p) => {
      const paramType = computeParamType(p);
      paramsValues[0].push({ type: paramType.toString(), name: p.name });
      paramsValues[1].push(p.value);
      return paramsValues;
    }, [[], []]);

    const jsonFunctionCall: IJsonFunctionCall = {
      name: functionName,
      type: 'function',
      inputs: <[{ type: string, name: string }]>inputsAndValues[0]
    }
    const encodedInput = this.web3.eth.abi.encodeFunctionCall(jsonFunctionCall, inputsAndValues[1]);
    return encodedInput;
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

export interface SmartContractParameter {
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

export interface IContractQueryRequestDto {
  fromAddress: string;
  contractAddress: string;
  funcName: string;
  inputValues?: [ContractArgument];
  outputTypes?: [ContractArgument];
}

interface ContractArgument {
  type: string;
  value: string;
}

export default Ethereum;