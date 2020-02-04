import functionTypeOptions from './associatedEnums/SCFunctionTypeOptions';
import SmartContractFunctionParam from './SmartContractFunctionParam';
/**
 * A generic object to describe a smart contract function.
 * @typedef {Object} SmartContractFunctionDefinition
 * @property {functionTypeOptions} functionType - what type of function does this describe (constructor, normal function call, with parameters, without parameters)
 * @property {string} functionName - the name of the function. In some circumstances, you can set to the empty string if the function type is constructor. Check documentation.
 * @property {string} code - the code  of the function or the code used to call the function
 * @property {SmartContractFunctionParam[]} inputParams - the list of parameters this function takes as input
 * @property {SmartContractFunctionParam[]} outputParams - the list of paramters this function gives as output
 */

/**
 * @memberof module:overledger-types
 */
type SmartContractFunctionDefinition = {
    functionType: functionTypeOptions,
    functionName: string,
    code?: string,
    inputParams?: SmartContractFunctionParam[],
    outputParams?: SmartContractFunctionParam[]
  };
  
  export default SmartContractFunctionDefinition;
  