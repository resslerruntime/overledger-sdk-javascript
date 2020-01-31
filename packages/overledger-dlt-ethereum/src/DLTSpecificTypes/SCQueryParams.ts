import SCQueryInputValue from './SCQueryInputValue';
import SCQueryOutputValue from './SCQueryOutputValue';


interface SCQueryParams {
    fromAddress: string,
    contractAddress: string,
    functionName: string,
    inputValues: SCQueryInputValue[],
    outputTypes: SCQueryOutputValue[],
  }

export default SCQueryParams;
