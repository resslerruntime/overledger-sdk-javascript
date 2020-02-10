/**
 * @module overledger-dlt-ethereum
 */

import Ethereum from './Ethereum';
import EthereumBytesOptions from './DLTSpecificTypes/associatedEnums/BytesBOptions';
import EthereumTypeOptions from './DLTSpecificTypes/associatedEnums/TypeOptions';
import EthereumUintIntOptions from './DLTSpecificTypes/associatedEnums/UintIntBOptions';
import SCEthereumParam from './DLTSpecificTypes/SCEthereumParam';
import SCQueryParams from './DLTSpecificTypes/SCQueryParams';
import SmartContractEthereum from './DLTSpecificTypes/SmartContractEthereum';
import TransactionEthereumRequest from './DLTSpecificTypes/TransactionEthereumRequest';
import TransactionEthereumResponse from './DLTSpecificTypes/TransactionEthereumResponse';

/**
 * Objects and interfaces used when interacting with the Ethereum package
 */
export {
    EthereumBytesOptions,
    EthereumTypeOptions,
    EthereumUintIntOptions,
    SCEthereumParam,
    SCQueryParams,
    SmartContractEthereum,
    TransactionEthereumRequest,
    TransactionEthereumResponse
}
/**
 * Development package for Ethereum.
 */
export default Ethereum;
