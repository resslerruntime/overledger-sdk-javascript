import SCEthereumParam from './SCEthereumParam';

/**
 * @memberof module:overledger-dlt-ethereum
 */ 
interface SCQueryParams {
    fromAddress: string,
    contractAddress: string,
    functionName: string,
    inputValues: SCEthereumParam[],
    outputTypes: SCEthereumParam[],
  }

export default SCQueryParams;
