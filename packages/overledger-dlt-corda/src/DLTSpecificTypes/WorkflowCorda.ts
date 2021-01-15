import CordaParam from './CordaParam';

/**
 * A description of an Corda workflow parameter.
 * @typedef {Object} CordaWorkflow
 * @property {string} cordappName - name of the cordApp where this workflow is present
 * @property {string} flowName - the name of the flow to invoke in this cordApp
 * @property {object} params - the params to input into this workflow
  
 */

/**
* @memberof module:overledger-dlt-corda
*/
interface CordaWorkflow  {
  cordappName: string;
  flowName: string;
  params: CordaParam[];
}

export default CordaWorkflow;
