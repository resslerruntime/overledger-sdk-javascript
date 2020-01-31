import Accounts from 'web3-eth-accounts';
import Web3 from 'web3';
import { MAINNET } from '@quantnetwork/overledger-provider';
import AbstractDLT from '@quantnetwork/overledger-dlt-abstract';
import { Options, Account, TransactionRequest } from '@quantnetwork/overledger-types';
import {TransactionSubTypeOptions, SCFunctionTypeOptions} from '@quantnetwork/overledger-types';
import TransactionEthereumRequest from './DLTSpecificTypes/TransactionEthereumRequest';
import SCEthereumParam from './DLTSpecificTypes/SCEthereumParam';
import SmartContractEthereum from './DLTSpecificTypes/SmartContractEthereum';
import computeParamType from './DLTSpecificTypes/ParamType';
import SCQueryParams from './DLTSpecificTypes/SCQueryParams';
import {AxiosPromise } from 'axios';
import SCQueryInputValue from './DLTSpecificTypes/SCQueryInputValue';
import SCQueryOutputValue from './DLTSpecificTypes/SCQueryOutputValue';

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
  buildTransaction(thisTransaction: TransactionEthereumRequest): Transaction {
    let ethereumSC = <SmartContractEthereum>thisTransaction.smartContract; //recasting for extra fields

    if (typeof thisTransaction.extraFields === 'undefined') {
      throw new Error('Transaction extraFields must be defined.');
    }

    if (typeof thisTransaction.amount === 'undefined') {
      throw new Error('A transaction.amount must be given');
    }

    if (typeof thisTransaction.extraFields.compLimit === 'undefined') {
      throw new Error('A transaction.extraFields.compLimit must be given');
    }

    if (typeof thisTransaction.extraFields.compUnitPrice === 'undefined') {
      throw new Error('A transaction.extraFields.compUnitPrice must be given');
    }

    if (typeof thisTransaction.sequence === 'undefined') {
      throw new Error('A transaction.sequence must be given');
    }

    if (!thisTransaction.toAddress && thisTransaction.subType === TransactionSubTypeOptions.smartContractInvocation) {
      throw new Error('If Transaction.subType === TransactionSubTypeOptions.smartContractInvocation then a transaction.toAddress, indicating the address of the smart contract to invoke.');
    }

    if (thisTransaction.amount > 0
      && (thisTransaction.subType === TransactionSubTypeOptions.smartContractDeploy || thisTransaction.subType === TransactionSubTypeOptions.smartContractInvocation)
      && ethereumSC.extraFields.payable === false) {
      throw new Error('If deploying or invoking a smart contract and Transaction.smartContract.functionCall.payable === "false", then transaction.amount must be set to 0');
    }

    let transactionData = "";
    let invocationType;
     if (thisTransaction.subType === TransactionSubTypeOptions.valueTransfer) {
        transactionData = this.web3.utils.asciiToHex(thisTransaction.message);
    } else if (thisTransaction.subType === TransactionSubTypeOptions.smartContractDeploy) {
      if (!thisTransaction.toAddress) {
        invocationType = thisTransaction.smartContract.functionCall[0].functionType;
        if (invocationType === SCFunctionTypeOptions.constructorWithNoParameters) {
          transactionData = thisTransaction.message;
        } else if (invocationType === SCFunctionTypeOptions.constructorWithParameters) {
          const paramsList = <SCEthereumParam[]>  thisTransaction.smartContract.functionCall[0].inputParams;
          if (!paramsList || paramsList.length <= 0) {
            throw new Error(`When deploying a smart contract with parameters, then thisTransaction.smartContract.functionCall.inputParams must be defined with a non-null length`);
          }
          transactionData = this.computeTransactionDataForConstructorWithParams(thisTransaction.message, paramsList);
        } else {
          throw new Error(`When deploying a smart contract, you must set the thisTransaction.smartContract.functionCall.functionType parameter to be one of SCFunctionTypeOptions`);
        }
      } else {
        throw new Error('When deploying a smart contract, the toAddress must be set to the empty string, i.e. Transaction.toAddress = "" ');
      }
    } else if (thisTransaction.subType === TransactionSubTypeOptions.smartContractInvocation) {
      invocationType = thisTransaction.smartContract.functionCall[0].functionType;
      if (thisTransaction.toAddress) {
        if ((invocationType === SCFunctionTypeOptions.functionCallWithParameters)||(invocationType === SCFunctionTypeOptions.functionCallWithNoParameters)) {
          const paramsList = <SCEthereumParam[]> thisTransaction.smartContract.functionCall[0].inputParams;
          if (!paramsList) {
            throw new Error(`If invoking a smart contract then the thisTransaction.smartContract.functionCall.inputParams parameter must be defined. If the called function takes no parameters then set it to the empty array, i.e. functionParameters = []`);
          }
          const functionName = thisTransaction.smartContract.functionCall[0].functionName;
          if (!functionName) {
            throw new Error(`When invoking a smart contract function, the name of the called function must be given by setting thisTransaction.smartContract.functionCall.functionName`);
          }
          transactionData = this.computeTransactionDataForFunctionCall(functionName, paramsList);
        }
        else {
          throw new Error(`When invoking a smart contract function thisTransaction.smartContract.functionCall.functionType must be set to SCFunctionTypeOptions.functionCall`);
        }
      } else {
        throw new Error('When invoking a smart contract, the toAddress must be set to a non empty string, equal to the ethereum address of the smart contract, i.e. Transaction.toAddress = "0x..." ');
      }
    }

    const transaction = {
      nonce: thisTransaction.sequence,
      chainId: this.chainId,
      to: thisTransaction.toAddress,
      gas: thisTransaction.extraFields.compLimit,
      gasPrice: thisTransaction.extraFields.compUnitPrice,
      value: thisTransaction.amount.toString(),
      data: transactionData,
    };
    return transaction;
  }

  computeTransactionDataForConstructorWithParams(message: string, paramsList: SCEthereumParam[]): string {
    const typesAndValues = paramsList.reduce((paramsValues, p) => {
      const paramType = computeParamType(p);
      paramsValues[0].push(paramType);
      paramsValues[1].push(p.value);
      return paramsValues;
    }, [[], []]);
    const encodedParams = this.web3.eth.abi.encodeParameters(typesAndValues[0], typesAndValues[1]).slice(2);
    return message + encodedParams;
  }

  computeTransactionDataForFunctionCall(functionName: string, paramsList: SCEthereumParam[]): string {
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
  _sign(thisTransaction: TransactionRequest): Promise<string> {

    const transaction = this.buildTransaction(<TransactionEthereumRequest>thisTransaction);

    return new Promise((resolve, reject) => {
      this.account.signTransaction(transaction, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data.rawTransaction);
      });
    });
  }

  buildSmartContractQuery(contractQueryDetails: SCQueryParams): Object {
    try {
      const data = {
        fromAddress: contractQueryDetails.fromAddress,
        contractAddress: contractQueryDetails.contractAddress,
        funcName: contractQueryDetails.functionName,
        inputValues: this.computeInputValuesList(contractQueryDetails.inputValues),
        outputTypes: this.computeOutputTypesList(contractQueryDetails.outputTypes)
      }
      return {success: true, response: data};
    } catch (e) {
      return {success: false, response: e.response};
    }
  }
  
  computeInputValuesList(inputFunctionParams: SCQueryInputValue[]) {
    const inputValues = inputFunctionParams.reduce((inputParams, p) => {
      const paramType = computeParamType(p);
      inputParams.push(<QueryInput>{type: paramType, value: p.value});
      return inputParams;
    }, []);
    return inputValues;
  }
  
  computeOutputTypesList(outputFunctionTypes: SCQueryOutputValue[]) {
    const outputTypes = outputFunctionTypes.reduce((outputTypes, p) => {
      const paramType = computeParamType(p);
      outputTypes.push(<QueryOutput>{type: paramType});
      return outputTypes;
    }, []);
    return outputTypes;
  }

}



interface QueryInput {
  type: string;
  value: string;
}

interface QueryOutput {
  type: string;
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