
import AbstractDLT from '@quantnetwork/overledger-dlt-abstract';
import { Options, Account, TransactionRequest, SCFunctionTypeOptions, ValidationCheck } from '@quantnetwork/overledger-types';
import TransactionHyperledgerFabricRequest from './DLTSpecificTypes/TransactionHyperledgerFabricRequest';
import SCHyperledgerFabricParam from './DLTSpecificTypes/SCHyperledgerFabricParam';
import SmartContractHyperledgerFabric from './DLTSpecificTypes/SmartContractHyperledgerFabric';
import computeParamType from './DLTSpecificTypes/ParamType';
import TypeOptions from './DLTSpecificTypes/associatedEnums/TypeOptions';
import TransactionHyperledgerFabricSubTypeOptions from './DLTSpecificTypes/associatedEnums/TransactionHyperledgerFabricSubTypeOptions';
//import { AxiosInstance, AxiosPromise } from 'axios';
//import Provider, { TESTNET } from '@quantnetwork/overledger-provider';
/**
 * @memberof module:overledger-dlt-hyperledger_fabric
*/
class HyperledgerFabric extends AbstractDLT {
  account: Account;
  options: Object;
  /**
   * Name of the DLT
   */
  name: string = 'hyperledger_fabric';

  /**
   * Symbol of the DLT
   */
  symbol: string = 'HLF';

  /**
   * @param {any} sdk - the sdk instance
   * @param {Object} options - any additional options to instantiate this dlt
   */
  constructor(sdk: any, options: Options = {}) {
    super(sdk, options);

    this.options = options;
  }

  /**
   * Create an Hyperledger Fabric account
   *
   * @return {Account} the new Hyperledger Fabric account
   */
  createAccount(): Account {

    throw 'The Hyperledger Fabric SDK does not currently support account creation - contact your network admin';

  }

  /**
   * Set an account for this specific DLT
   *
   * @param {string} userId The id of the user
   */
  setAccount(userId: string): void {
    this.account.privateKey = userId;
  }

  /**
   * Takes the Overledger definition of a transaction and converts it into a specific Hyperledger Fabric transaction
   * @param {TransactionHyperledgerFabricRequest} thisTransaction - details on the information to include in this transaction for the Hyperledger Fabric distributed ledger
   * @return {Transaction} the Hyperledger Fabric transaction
   */
  buildTransaction(thisTransaction: TransactionHyperledgerFabricRequest): Transaction {
    super.transactionValidation(thisTransaction);
    let invocationType;
    let argsAsArray = [];
    if (thisTransaction.subType.name === TransactionHyperledgerFabricSubTypeOptions.SMART_CONTRACT_INVOCATION) {
      invocationType = thisTransaction.smartContract.functionCall[0].functionType;
      if (thisTransaction.toAddress) {
        if ((invocationType === SCFunctionTypeOptions.FUNCTION_CALL_WITH_PARAMETERS) || (invocationType === SCFunctionTypeOptions.FUNCTION_CALL_WITH_NO_PARAMETERS)) {
          const paramsList = <SCHyperledgerFabricParam[]>thisTransaction.smartContract.functionCall[0].inputParams;
          if (!paramsList) {
            throw new Error('If invoking a smart contract then the thisTransaction.smartContract.functionCall.inputParams parameter must be defined. If the called function takes no parameters then set it to the empty array, i.e. functionParameters = []');
          }
          const functionName = thisTransaction.smartContract.functionCall[0].functionName;
          if (!functionName) {
            throw new Error('When invoking a smart contract function, the name of the called function must be given by setting thisTransaction.smartContract.functionCall.functionName');
          }
          argsAsArray = this.computeTransactionDataForFunctionCall(invocationType,paramsList);
        } else {
          throw new Error('When invoking a smart contract function thisTransaction.smartContract.functionCall.functionType must be set to SCFunctionTypeOptions.functionCallWithNoParameters or SCFunctionTypeOptions.functionCallWithParameters');
        }
      } else {
        throw new Error('When invoking a smart contract, the toAddress must be set to a non empty string, equal to the id of the smart contract, i.e. Transaction.toAddress = "<smartContractName>" ');
      }

    }
    const hyperledgerFabricSC = <SmartContractHyperledgerFabric>thisTransaction.smartContract; // recasting for extra fields

    const transaction = {
      userId: thisTransaction.fromAddress,
      connectionProfileJSON: hyperledgerFabricSC.extraFields.connectionProfileJSON,
      channelName: hyperledgerFabricSC.extraFields.channelName,
      chaincodeId: thisTransaction.toAddress,
      functionName: thisTransaction.smartContract.functionCall[0].functionName,
      functionArgs: argsAsArray,
    }
    return transaction;
  }

  /**
   * validates an OVL transactionRequest according to Hyperledger Fabric specific rules
   * @param thisTransaction - The transaction request
   */
  _transactionValidation(thisTransaction: TransactionRequest): ValidationCheck {

    // now input validation on a Hyperledger Fabric transaction
    const thisHyperledgerFabricTx = <TransactionHyperledgerFabricRequest>thisTransaction;
    const hyperledgerFabricSC = <SmartContractHyperledgerFabric>thisHyperledgerFabricTx.smartContract; // recasting for extra fields

    if (!Object.values(TransactionHyperledgerFabricSubTypeOptions).includes(thisHyperledgerFabricTx.subType.name)) {
      return {
        success: false,
        failingField: 'subType',
        error: 'You must select a subType from TransactionSubTypeOptions',
      };
    }
    if ((!thisHyperledgerFabricTx.extraFields) || (thisHyperledgerFabricTx.extraFields == null)) {
      return {
        success: false,
        failingField: 'extraFields',
        error: 'All transactions for HyperledgerFabric must have the extraFields field set with connectionProfileJSON and channelName parameters within it',
      };
    }
    if ((hyperledgerFabricSC.extraFields.connectionProfileJSON === '') || (hyperledgerFabricSC.extraFields.connectionProfileJSON == null) || (hyperledgerFabricSC.extraFields.connectionProfileJSON === 'undefined')) {
      return {
        success: false,
        failingField: 'smartContract.extraFields.connectionProfileJSON',
        error: 'All transactions for HyperledgerFabric must have the smartContract.extraFields.connectionProfileJSON field set',
      };
    }
    if ((hyperledgerFabricSC.extraFields.channelName === '') || (hyperledgerFabricSC.extraFields.channelName == null) || (hyperledgerFabricSC.extraFields.channelName === 'undefined')) {
      return {
        success: false,
        failingField: 'smartContract.extraFields.channelName',
        error: 'All transactions for HyperledgerFabric must have the smartContract.extraFields.channelName field set',
      };
    }
    if ((thisHyperledgerFabricTx.subType.name === TransactionHyperledgerFabricSubTypeOptions.SMART_CONTRACT_INVOCATION) && (!thisHyperledgerFabricTx.smartContract)) {
      return {
        success: false,
        failingField: 'smartContract',
        error: 'To invoke a smart contract on HyperledgerFabric, you need to define a smartContract object',
      };
    }
    if ((thisHyperledgerFabricTx.subType.name === TransactionHyperledgerFabricSubTypeOptions.SMART_CONTRACT_INVOCATION) && (!hyperledgerFabricSC.functionCall)) {
      return {
        success: false,
        failingField: 'smartContract.functionCall',
        error: 'To invoke a smart contract on HyperledgerFabric, you need to provide the smartContract.functionCall field',
      };
    }
    if ((thisHyperledgerFabricTx.subType.name === TransactionHyperledgerFabricSubTypeOptions.SMART_CONTRACT_INVOCATION) && (!hyperledgerFabricSC.functionCall[0].functionType)) {
      return {
        success: false,
        failingField: 'smartContract.functionCall[0].functionType',
        error: 'To invoke a smart contract on HyperledgerFabric, you need to provide the smartContract.functionCall[0].functionType field and set it equal to functionCallWithNoParameters or functionCallWithParameters',
      };
    }
    if ((thisHyperledgerFabricTx.subType.name === TransactionHyperledgerFabricSubTypeOptions.SMART_CONTRACT_INVOCATION)
      && (hyperledgerFabricSC.functionCall[0].functionType === SCFunctionTypeOptions.FUNCTION_CALL_WITH_PARAMETERS) && (hyperledgerFabricSC.functionCall[0].inputParams.length === 0)) {
      return {
        success: false,
        failingField: 'smartContract.functionCall[0].inputParams',
        error: 'To invoke a smart contract on Ethereum that has parameters in its function, you need to provide them in the smartContract.functionCall[0].inputParams field',
      };
    }
    if (((!thisHyperledgerFabricTx.toAddress) || (thisHyperledgerFabricTx.toAddress === '')) && thisHyperledgerFabricTx.subType.name === TransactionHyperledgerFabricSubTypeOptions.SMART_CONTRACT_INVOCATION) {
      return {
        success: false,
        failingField: 'toAddress',
        error: 'If Transaction.subType.name === TransactionSubTypeOptions.smartContractInvocation then a transaction.toAddress needs to be set indicating the address of the smart contract to invoke.',
      };
    }

    // for each parameter in the smart contract inputs and outputs
    // check there is a type and a value???
    let counter = 0;
    if ((thisHyperledgerFabricTx.subType.name === TransactionHyperledgerFabricSubTypeOptions.SMART_CONTRACT_INVOCATION) && (hyperledgerFabricSC.functionCall[0].inputParams)) {
      while (counter < hyperledgerFabricSC.functionCall[0].inputParams.length) {
        const thisSCHyperledgerFabricParam = <SCHyperledgerFabricParam>hyperledgerFabricSC.functionCall[0].inputParams[counter];
        if (!thisSCHyperledgerFabricParam.type) {
          return {
            success: false,
            failingField: 'smartcontract.functionCall[0].inputParams[counter].type',
            error: 'To invoke a Hyperledger Fabric smart contract function that has input parameters, you need to provide the type field for each smart contract input parameter',
          };
        }
        if ((!thisSCHyperledgerFabricParam.type.selectedType) || ((!Object.values(TypeOptions).includes(thisSCHyperledgerFabricParam.type.selectedType)))) {
          return {
            success: false,
            failingField: 'smartcontract.functionCall[0].inputParams[counter].type.selectedType',
            error: 'To invoke a smart contract on Hyperledger Fabric that has input parameters, you need to provide the selectedType field for each smart contract input parameter type, selected from TypeOptions in the Hyperledger Fabric Package',
          };
        }
        const arrayUsed = (thisSCHyperledgerFabricParam.type.selectedType === TypeOptions.BOOLEAN_ARRAY)
          || (thisSCHyperledgerFabricParam.type.selectedType === TypeOptions.DOUBLE_ARRAY)
          || (thisSCHyperledgerFabricParam.type.selectedType === TypeOptions.INTEGER_ARRAY)
          || (thisSCHyperledgerFabricParam.type.selectedType === TypeOptions.STRING_ARRAY);
        if (arrayUsed
          && (thisSCHyperledgerFabricParam.type.selectedArrayLength !== undefined) && !(typeof thisSCHyperledgerFabricParam.type.selectedArrayLength === 'number')) {
          return {
            success: false,
            failingField: 'functionCall[0].inputParams[counter].type.selectedArrayLength',
            error: 'The selected length of the array size must be an integer',
          };
        }
        if (arrayUsed
          && (thisSCHyperledgerFabricParam.type.selectedArrayLength !== undefined) && !Array.isArray(thisSCHyperledgerFabricParam.value)) {
          return {
            success: false,
            failingField: 'functionCall[0].inputParams[counter].value',
            error: 'The value must be an array',
          };
        }
        if (arrayUsed
          && (thisSCHyperledgerFabricParam.type.selectedArrayLength !== undefined)
          && Array.isArray(thisSCHyperledgerFabricParam.value) && thisSCHyperledgerFabricParam.type.selectedArrayLength !== thisSCHyperledgerFabricParam.value.length) {
          return {
            success: false,
            failingField: 'functionCall[0].inputParams[counter].value',
            error: 'The array must have the selectedArrayLength size',
          };
        }
        if (!thisSCHyperledgerFabricParam.name) {
          return {
            success: false,
            failingField: 'smartcontract.functionCall[0].inputParams[counter].name',
            error: 'To invoke a smart contract on Hyperledger Fabric that has input parameters, you need to provide the name field for each smart contract input parameter',
          };
        }
        if (thisSCHyperledgerFabricParam.value === undefined) {
          return {
            success: false,
            failingField: 'smartcontract.functionCall[0].inputParams[counter].value',
            error: 'To invoke a smart contract on Hyperledger Fabric that has input parameters, you need to provide the value field for each smart contract input parameter',
          };
        }
        counter = counter + 1;
      }
    }
    if ((thisHyperledgerFabricTx.subType.name === TransactionHyperledgerFabricSubTypeOptions.SMART_CONTRACT_INVOCATION) && (hyperledgerFabricSC.functionCall[0].outputParams)) {
      return {
        success: false,
        failingField: 'smartcontract.functionCall[0].outputParams',
        error: 'To deploy or invoke a smart contract on Hyperledger Fabric you should not list the output parameters',
      };
    }

    return { success: true };
  }

  /**
   * validates an OVL smart contract query according to Hyperledger Fabric specific rules
   * @param {SmartContract} contractQueryDetails - The transaction request
   */
  _smartContractQueryValidation(contractQueryDetails: SmartContractHyperledgerFabric): ValidationCheck {
    // code must be empty
    if (contractQueryDetails.code) {
      return {
        success: false,
        failingField: 'code',
        error: 'The smart contract code should be set to the empty string when querying',
      };
    }
    if (!contractQueryDetails.functionCall[0].functionType) {
      return {
        success: false,
        failingField: 'functionCall[0].functionType',
        error: 'The smart contract query should include a functionType',
      };
    }
    if ((contractQueryDetails.functionCall[0].functionType === SCFunctionTypeOptions.CONSTRUCTOR_WITH_NO_PARAMETERS)
      || ((contractQueryDetails.functionCall[0].functionType === SCFunctionTypeOptions.CONSTRUCTOR_WITH_PARAMETERS))) {
      return {
        success: false,
        failingField: 'functionCall[0].functionType',
        error: 'The smart contract query should include a functionType set to functionCallWithParameters or functionCallWithNoParameters',
      };
    }
    if (!contractQueryDetails.functionCall[0].functionName) {
      return {
        success: false,
        failingField: 'functionCall[0].functionName',
        error: 'The smart contract query should include a functionName',
      };
    }
    if ((contractQueryDetails.functionCall[0].functionType === SCFunctionTypeOptions.FUNCTION_CALL_WITH_PARAMETERS) && (!contractQueryDetails.functionCall[0].inputParams)) {
      return {
        success: false,
        failingField: 'functionCall[0].inputParams',
        error: 'The smart contract query for a function call with parameters should include the functionCall[0].inputParams field',
      };
    }
    if (!contractQueryDetails.functionCall[0].outputParams) {
      return {
        success: false,
        failingField: 'functionCall[0].outputParams',
        error: 'The smart contract query should include the functionCall[0].outputParams field',
      };
    }
    // input and output parameters must follow specific format
    let counter = 0;
    if (contractQueryDetails.functionCall[0].inputParams) {
      while (counter < contractQueryDetails.functionCall[0].inputParams.length) {
        const thisSCHyperledgerFabricParam = <SCHyperledgerFabricParam>contractQueryDetails.functionCall[0].inputParams[counter];
        if (!thisSCHyperledgerFabricParam.type) {
          return {
            success: false,
            failingField: 'functionCall[0].inputParams[counter].type',
            error: 'To query an Hyperledger Fabric smart contract function that has input parameters, you need to provide the type field for each smart contract input parameter',
          };
        }
        if ((!thisSCHyperledgerFabricParam.type.selectedType) || ((!Object.values(TypeOptions).includes(thisSCHyperledgerFabricParam.type.selectedType)))) {
          return {
            success: false,
            failingField: 'functionCall[0].inputParams[counter].type.selectedType',
            error: 'To query a smart contract on Hyperledger Fabric that has input parameters, you need to provide the selectedType field for each smart contract input parameter type, selected from TypeOptions in the Hyperledger Fabric Package',
          };
        }
        if (!thisSCHyperledgerFabricParam.name) {
          return {
            success: false,
            failingField: 'functionCall[0].inputParams[counter].name',
            error: 'To query a smart contract on Hyperledger Fabric that has input parameters, you need to provide the name field for each smart contract input parameter',
          };
        }
        if (thisSCHyperledgerFabricParam.value === undefined) {
          return {
            success: false,
            failingField: 'functionCall[0].inputParams[counter].value',
            error: 'To query a smart contract on Hyperledger Fabric that has input parameters, you need to provide the value field for each smart contract input parameter',
          };
        }
        counter = counter + 1;
      }
    }
    if (contractQueryDetails.functionCall[0].outputParams) {
      counter = 0;
      while (counter < contractQueryDetails.functionCall[0].outputParams.length) {
        const thisSCHyperledgerFabricParam = <SCHyperledgerFabricParam>contractQueryDetails.functionCall[0].outputParams[counter];
        if (!thisSCHyperledgerFabricParam.type) {
          return {
            success: false,
            failingField: 'functionCall[0].outputParams[counter].type',
            error: 'To query an Hyperledger Fabric smart contract function that has output parameters, you need to provide the type field for each smart contract output parameter',
          };
        }
        if ((!thisSCHyperledgerFabricParam.type.selectedType) || (!Object.values(TypeOptions).includes(thisSCHyperledgerFabricParam.type.selectedType))) {
          return {
            success: false,
            failingField: 'functionCall[0].outputParams[counter].type.selectedType',
            error: 'To query a smart contract on Hyperledger Fabric that has output parameters, you need to provide the selectedType field for each smart contract output parameter type, selected from TypeOptions in the Hyperledger Fabric Package',
          };
        }
        counter = counter + 1;
      }
    }
    return { success: true };

  }

  /**
   * Convert Overledger object description of a smart contract function and parameters into Hyperledger Fabric versions
   * @param {string} invocationType - the type of smart contract function call
   * @param {SCHyperledgerFabricParam[]} paramsList - the list of parameters that this function takes as input
   *
   * @return {string} the bytecode of this function call
   */
  private computeTransactionDataForFunctionCall(invocationType: string, paramsList: SCHyperledgerFabricParam[]): string[] {
    if (invocationType === SCFunctionTypeOptions.FUNCTION_CALL_WITH_NO_PARAMETERS){
      return [];
    } else {
      //loop through all the parameters and just add the value (not the type) into the return
      let toReturn = [];
      let count = 0;
      while (count < paramsList.length){
        toReturn.push(paramsList[count].value);
        count = count + 1;
      }
      return toReturn;
    }
  }

  /**
   * Takes in an overledger definition of a transaction for Hyperledger Fabric, converts it into a form that the Hyperledger Fabric distributed ledger will understand, and then signs the transaction
   * @param {TransactionRequest} thisTransaction - an instantiated overledger definition of a Hyperledger Fabric transaction
   */
  _sign(thisTransaction: TransactionRequest): Promise<string> {

    throw 'The Hyperledger Fabric SDK does not currently support client side transaction signing, transaction: ' + JSON.stringify(thisTransaction);

  }

  /**
   * Allows a user to build a smart contract query for the Hyperledger Fabric distributed ledger
   * @param {string} dltAddress - the user's Hyperledger Fabric address
   * @param {SmartContractHyperledgerFabric} contractQueryDetails - the definition of the smart contract function the user wants to interact with,
   * including information on what parameters to use in the function call.
   *
   * @return {Object} success indicates if this query building was correct, if yes then it will be in the response field of the object
   */
  _buildSmartContractQuery(dltAddress: string, contractQueryDetails: SmartContractHyperledgerFabric): Object {
    try {
      const theseHyperledgerFabricInputParams = <SCHyperledgerFabricParam[]>contractQueryDetails.functionCall[0].inputParams;
      const data = {
        userId: dltAddress,
        chaincodeId: contractQueryDetails.id,
        connectionProfileJSON: contractQueryDetails.extraFields.connectionProfileJSON,
        channelName: contractQueryDetails.extraFields.channelName,
        functionName: contractQueryDetails.functionCall[0].functionName,
        functionArgs: this.computeSCQueryInputValuesList(theseHyperledgerFabricInputParams),
      };
      return { success: true, response: data };
    } catch (e) {
      return { success: false, response: e.response };
    }
  }

  /**
   * computes the input parameters into the smart contract function query
   * @param {SCHyperledgerFabricParam[]} inputFunctionParams - the list of input parameters
   */
  private computeSCQueryInputValuesList(inputFunctionParams: SCHyperledgerFabricParam[]) {
    let count = 0;
    let params = [];
    while (count < inputFunctionParams.length){
      params.push(inputFunctionParams[count].value);
      count = count + 1;
    }
    return params;
  }

  /**
   * computes the output parameters into the smart contract function query
   * @param {SCHyperledgerFabricParam[]} outputFunctionTypes
   */
  computeSCQueryOutputTypesList(outputFunctionTypes: SCHyperledgerFabricParam[]) {
    const outputTypes =
      outputFunctionTypes.reduce((outputTypes, p) => { const paramType = computeParamType(p); outputTypes.push(<QueryOutput>{ type: paramType }); return outputTypes; }, []);
    return outputTypes;
  }

}


interface QueryOutput {
  type: string;
}

export type Transaction = {
  userId: string,
  connectionProfileJSON: string,
  channelName: string,
  chaincodeId: string,
  functionName: string,
  functionArgs: string[],
};

export default HyperledgerFabric;
