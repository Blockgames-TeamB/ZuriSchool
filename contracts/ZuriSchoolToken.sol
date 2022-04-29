//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
* @author TeamB - Blockgames Internship 2022
* @title ZuriSchoolToken minting contract
*/
contract ZuriSchoolToken is ERC20 {
    constructor() ERC20("ZuriSchoolToken", "ZST") {}

    /** 
    * @notice mints specified amount of tokens to an address.
    * @dev callable only by owner of contract
    */
    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}
