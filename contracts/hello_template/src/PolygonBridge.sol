// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";


contract PolygonBridge is ERC20 , Ownable {

    constructor() ERC20("WrappedETHER","WETH") Ownable(msg.sender){}

    function mint (address _address, uint256 _amount) public onlyOwner {
        _mint(_address , _amount);
    }
    function burn (address _address, uint256 _amount) public onlyOwner {
        _burn(_address,_amount);
    }

}
