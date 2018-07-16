pragma solidity ^0.4.2;

import './DappToken.sol';

contract DappTokenSale {
    address admin;
    DappToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(
        address indexed _buyer,
        uint256 indexed _amount
    );

    constructor(DappToken _tokenContract, uint256 _tokenPrice) public {
        // Assigns an admin.
        admin = msg.sender;

        // Token contract.
        tokenContract = _tokenContract;

        // Token price.
        tokenPrice = _tokenPrice;
    }

    function multiply(uint256 x, uint256 y)
        internal
        pure
        returns (uint z)
    {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        // Require that the value is equal to the tokens.
        require(msg.value == multiply(_numberOfTokens, tokenPrice));

        // Require that there are enough tokens in the contract.
        require(tokenContract.balanceOf(this) >= _numberOfTokens);

        // Require that the transfer is successful.
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        // Keep track of the number of tokens sold.
        tokensSold += _numberOfTokens;

        // Emit a Sell event.
        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
        // Require that only admin can do this.
        require(msg.sender == admin);

        // Transfer remaining tokens to admin.
        require(tokenContract.transfer(
            admin,
            tokenContract.balanceOf(this)));

        // Destroy this contract.
        selfdestruct(admin);
    }
}
