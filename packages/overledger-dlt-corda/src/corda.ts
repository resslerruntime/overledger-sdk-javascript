
import AbstractDLT from '@quantnetwork/overledger-dlt-abstract';
import { Options, Account, TransactionRequest, ValidationCheck } from '@quantnetwork/overledger-types';
import WorkflowCorda from './DLTSpecificTypes/WorkflowCorda';
import CordaParam from './DLTSpecificTypes/CordaParam';
/**
 * @memberof module:overledger-dlt-corda
*/
class Corda extends AbstractDLT {
  account: Account;
  options: Object;
  /**
   * Name of the DLT
   */
  name: string = 'corda';

  /**
   * Symbol of the DLT
   */
  symbol: string = 'CORDA';

  /**
   * @param {any} sdk - the sdk instance
   * @param {Object} options - any additional options to instantiate this dlt
   */
  constructor(sdk: any, options: Options = {}) {
    super(sdk, options);

    this.options = options;
  }

  /**
   * Create an Corda account
   *
   * @return {Account} the new Corda account
   */
  createAccount(): Account {

    throw 'The Corda SDK does not currently support account creation - contact your network admin';

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
   * Takes the Overledger definition of a transaction and converts it into a specific Corda transaction
   */
  buildTransaction(): void {
 
    throw 'Corda transactions are built via the invokeWorkflow, which triggers a Corda node to perform a process to build a correctly formatted transaction';

  }

  /**
   * Takes the Overledger definition of a Corda workflow and converts it into a specific Corda Workflow
   * @param {WorkflowCorda} thisTransaction - details on the information to include in this workflow for the Corda distributed ledger node
   * @return {Workflow} the Corda transaction
   */
  buildWorkflow(thisWorkflow: WorkflowCorda): Workflow {
    let check = this.workflowValidation(thisWorkflow);
    if (check.success === false){
      throw "Workflow validation failure.\nFailing field: " + check.failingField + "\nError: " + check.error;
    }

    //create the string version of detailsParams
    let detailsParamsString = '{ ';
    let count = 0;

    while (count < thisWorkflow.params.length){
      let thisValue;
      if ((thisWorkflow.params[count].value.toString() === 'false')||(thisWorkflow.params[count].value.toString() === 'true')){
        thisValue = thisWorkflow.params[count].value.toString();
      } else {
        thisValue = '"' + thisWorkflow.params[count].value.toString() + '"';     
      }
      if (count + 1 == thisWorkflow.params.length){
        detailsParamsString = detailsParamsString + '"' + thisWorkflow.params[count].name + '"' + ": " + thisValue;  
      } else {
        detailsParamsString = detailsParamsString + '"' + thisWorkflow.params[count].name + '"' + ": " + thisValue + ", ";  
      }
      count = count + 1;
    }
    detailsParamsString = detailsParamsString + " }";
    let detailsParams = JSON.parse(detailsParamsString);

    const workflowDetails = {
      tracking: false,
      cordappName: thisWorkflow.cordappName,
      flowName: thisWorkflow.flowName,
      params: detailsParams,
    }
    
    const workflow = {
      overledgerTransactionId: this.create_UUID(),
      dltMessageId: this.create_UUID(),
      dlt: "corda",
      version: "4.0",
      endpoint: "transactions",
      reference: this.create_UUID(),
      details: workflowDetails,
    }
    return workflow;
  }

  /**
   * Creates a new UUID
   */
  create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

  /**
   * validates an OVL transactionRequest according to Corda specific rules
   */
  _transactionValidation(): ValidationCheck {

    throw 'Corda transactions are built via the invokeWorkflow, which triggers a Corda node to perform a process to build a correctly formatted transaction';

  }

  /**
   * validates an OVL Corda workflow according to Corda specific rules
   * @param {WorkflowCorda} thisWorkflow - The workflow details
   */
  workflowValidation(thisWorkflow: WorkflowCorda): ValidationCheck {
    if (!thisWorkflow.cordappName) {
      return {
        success: false,
        failingField: 'cordappName',
        error: 'The workflow should include a cordappName',
      };
    }
    if (!thisWorkflow.flowName) {
      return {
        success: false,
        failingField: 'flowName',
        error: 'The workflow should include a flowName',
      };
    }
    if (!thisWorkflow.params) {
      return {
        success: false,
        failingField: 'params',
        error: 'The workflow should include params',
      };
    }
    // input and output parameters must follow specific format
    let counter = 0;
      while (counter < thisWorkflow.params.length) {
        const thisCordaParam = <CordaParam>thisWorkflow.params[counter];
        if (!thisCordaParam.name) {
          return {
            success: false,
            failingField: 'thisCordaParam['+ counter.toString() +'].name',
            error: 'To build a Corda workflow, you need to provide the name field for workflow parameter',
          };
        }
        if ((!thisCordaParam.value)&&(thisCordaParam.value.toString() !== 'false')) {
          return {
            success: false,
            failingField: 'thisCordaParam['+ counter.toString() +'].value',
            error: 'To build a Corda workflow, you need to provide the value field for workflow parameter',
          };
        }
        counter = counter + 1;
      }
    return { success: true };

  }

  /**
   * Takes in an overledger definition of a transaction for Corda, converts it into a form that the Corda distributed ledger will understand, and then signs the transaction
   * @param {TransactionRequest} thisTransaction - an instantiated overledger definition of an Corda transaction
   */
  _sign(thisTransaction: TransactionRequest): Promise<string> {

    throw 'The Corda SDK does not currently support client side transaction signing, transaction: ' + JSON.stringify(thisTransaction);

  }

   /**
   * validates an OVL smart contract query according to Corda specific rules
   */
  _smartContractQueryValidation(): ValidationCheck {

    throw 'The Corda SDK does not currently support individual smart contract querying, as all smart contracts are embedded into a transaction, so use search.getTransaction instead';

  }

  /**
   * Allows a user to build a smart contract query for the Corda distributed ledger
   */
  _buildSmartContractQuery(): Object {

    throw 'The Corda SDK does not currently support individual smart contract querying, as all smart contracts are embedded into a transaction, so use search.getTransaction instead';

  }

}

export type Workflow = {
	overledgerTransactionId: string,
	dltMessageId: string,
	dlt: string,
	version: string,
	endpoint: string,
  reference: string,
  details: WorkflowDetails,
};

export type WorkflowDetails = {
  tracking: boolean,
  cordappName: string,
  flowName: string,
  params: object,
};

export default Corda;
