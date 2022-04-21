//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/// @author TeamB - Blockgames Internship 2022
/// @title ZuriSchoolToken minting contract

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZuriSchoolToken is ERC20, Ownable {
    constructor() ERC20("ZuriSchoolToken", "ZST") {}

    ///@notice mints _amount of tokens to _to address, callable only by owner of contract
    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }
}