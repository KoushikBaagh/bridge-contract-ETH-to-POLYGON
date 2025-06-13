// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract EthBridge{

    event LockETH(address indexed sender, uint256 amount);
    mapping(address => uint256) public lockedBalance;

    function Locking() public payable{
        require(msg.value> 0 , "Cannot Lock 0 Ether");
        lockedBalance[msg.sender] += msg.value;
        emit LockETH(msg.sender, msg.value);
    }
}
