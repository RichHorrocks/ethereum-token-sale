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

    function buyTokens(uint256 _numberOfTokens) public payable {
        // Require that the value is equal to the tokens.
        // Require that there are enough tokens in the contract.
        // Require that the transfer is successful.
        // Keep track of the number of tokens sold.

        // Emit a Sell event.
    }
}
