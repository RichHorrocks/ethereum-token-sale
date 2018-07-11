pragma solidity ^0.4.2;

import './DappToken.sol';

contract DappTokenSale {
    address admin;
    DappToken public tokenContract;
    uint256 public tokenPrice;

    constructor(DappToken _tokenContract, uint256 _tokenPrice) public {
        // Assigns an admin.
        admin = msg.sender;

        // Token contract.
        tokenContract = _tokenContract;

        // Token price.
        tokenPrice = _tokenPrice;
    }
}
