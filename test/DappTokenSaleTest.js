var DappTokenSale = artifacts.require('./DappTokenSale.sol');
var DappToken = artifacts.require('./DappToken');

contract('DappTokenSale', function (accounts) {
  var tokenSaleInstance;
  var tokenInstance;
  // Token price is 0.001 ETH.
  var tokenPrice = 1000000000000000;
  var admin = accounts[0];
  var buyer = accounts[1];
  var tokensAvailable = 750000; // 75% of 1,000,000
  var numberOfTokens;

  it('initialises the contract with the correct values', function () {
    return DappTokenSale.deployed().then(function (instance) {
      tokenSaleInstance = instance;
      return tokenSaleInstance.address;
    }).then(function (address) {
      assert.notEqual(address, 0x0, 'has contract address');
      return tokenSaleInstance.tokenContract();
    }).then(function (address) {
      assert.notEqual(address, 0x0, 'has a token contract address');
      return tokenSaleInstance.tokenPrice();
    }).then(function (price) {
      assert.equal(price, tokenPrice, 'token price is correct');
    });
  });

  it('facilitates token buying', function () {
    return DappToken.deployed().then(function (instance) {
      // Grab the token instance first.
      tokenInstance = instance;
      return DappTokenSale.deployed();
    }).then(function (instance) {
      // Then grab the token sale instance.
      tokenSaleInstance = instance;

      // Give the token sale contract some of the tokens. (75%)
      // account[0] deployed the token contract, so owns the tokens.
      return tokenInstance.transfer(
        tokenSaleInstance.address,
        tokensAvailable, {
          from: admin,
        });
    }).then(function (receipt) {
      numberOfTokens = 10;
      return tokenSaleInstance.buyTokens(numberOfTokens,
        { from: buyer,
          value: numberOfTokens * tokenPrice });
    }).then(function (receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sell', 'should be a "Sell" event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
      assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
      return tokenSaleInstance.tokensSold();
    }).then(function (amount) {
      assert.equal(amount.toNumber(), numberOfTokens, ' increments the number of tokens sold');
      return tokenInstance.balanceOf(tokenSaleInstance.address);
    }).then(function (balance) {
      assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
      return tokenInstance.balanceOf(buyer);
    }).then(function (balance) {
      assert.equal(balance.toNumber(), numberOfTokens);
  

      // Try to buy tokens different from ether value.
      return tokenSaleInstance.buyTokens(numberOfTokens,
        { from: buyer,
          value: 1 });
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
      // Try to buy more tokens that the contract has. (i.e. More than 750,000.)
      return tokenSaleInstance.buyTokens(800000,
        { from: buyer,
          value: numberOfTokens * tokenPrice });
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, 'number of tokens must be equal or less to the number owned by the contract');
    });
  });
});
