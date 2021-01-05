pragma solidity ^0.5.0;
contract basicETHXRPSwapExample {
    mapping (uint => Request) listOfRequests;
    uint public requestCounter = 0;
    string public contractIdentifier;
    struct Request {
        address receiver; //who will receive the ETH
        uint256 ethValue; //how much ETH to receive (in Wei)
        string xrpTransactionHash; //the details of the XRP transaction
        bool completed; //has this swap completed?
    }
    constructor (string memory contractByteCodeHash) public {
        contractIdentifier = contractByteCodeHash;
    }
    // Party A initialises ETH/XRP (non atomic!) swap
    function initiateRequest(address addressReceiver) payable external {
      listOfRequests[requestCounter].receiver = addressReceiver;
      listOfRequests[requestCounter].ethValue = msg.value;
      requestCounter++;
    }
    // Party B finalises the swap
    function finaliseRequest(uint requestID, string calldata thisXrpTransactionHash) external {
        require(listOfRequests[requestID].completed == false, "This swap has already been completed!");
        require(listOfRequests[requestID].receiver == msg.sender, "Only the receiver of the swap can finalise the swap!");
        listOfRequests[requestID].xrpTransactionHash = thisXrpTransactionHash;
        listOfRequests[requestID].completed = true;
        msg.sender.transfer(listOfRequests[requestID].ethValue);
    }
    function RequestReceiver(uint256 id) external view returns (address){
        return listOfRequests[id].receiver;
    }
    function RequestEthValue(uint256 id) external view returns (uint256){
        return listOfRequests[id].ethValue;
    }
    function RequestXrpTransactionHash(uint256 id) external view returns (string memory){
        return listOfRequests[id].xrpTransactionHash;
    }
    function RequestCompleted(uint256 id) external view returns (bool){
        return listOfRequests[id].completed;
    }
}