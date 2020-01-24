pragma solidity ^0.5.0;

contract overledgerSCDemo {

    bool testBool;
    int testInt;
    uint16 testUint;
    bytes32 testBytes;
    address testAddress;
    string testString;
    bool[] testArray;

    /// Create a new smart contract and initialise the test variables
    constructor(bool thisTestBool, int256 thisTestInt, uint16 thisTestUint, bytes32 thisTestBytes,address thisTestAddress,string memory thisTestString,bool[] memory thisTestArray) public {
        testBool = thisTestBool;
        testInt = thisTestInt;
        testUint = thisTestUint;
        testBytes = thisTestBytes;
        testAddress = thisTestAddress;
        testString = thisTestString;
        testArray = thisTestArray;
    }

    function setOVLTestBool(bool newBool) external {
        testBool = newBool;
    }
    
    function setOVLTestInt(int newInt) external {
        testInt = newInt;
    }
    
    function setOVLTestUint(uint16 newUint) external {
        testUint = newUint;
    }
    
    function setOVLTestBytes(bytes6 newBytes) external {
        testBytes = newBytes;
    }
    
    function setOVLTestAddress(address newAddress) external {
        testAddress = newAddress;
    }
    
    function setOVLTestString(string calldata newString) external {
        testString = newString;
    }
    
    function setOVLTestArray(bool[] calldata newArray) external {
        testArray = newArray;
    }
    
    function getOVLTestBool() external view returns(bool){
        return testBool;
    }
    
    function getOVLTestInt() external view returns(int){
        return testInt;
    }
    
    function getOVLTestUint() external view returns(uint16){
        return testUint;
    }
    
    function getOVLTestBytes() external view returns(bytes32){
        return testBytes;
    }
    
    function getOVLTestAddress() external view returns(address){
        return testAddress;
    }
    
    function getTestString() external view returns(string memory){
        return testString;
    }
    
    function getTestArray(uint index) external view returns(bool){
        return testArray[index];
    }
}