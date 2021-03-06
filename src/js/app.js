App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  tokenPrice: 1000000000000000,

  init: function () {
    console.log('App initialised...');
  },

  initWeb3: function () {
//    if (typeof web3 !== 'undefined') {
//      App.web3Provider = web3.currentProvider;
//      web3 = new Web3(web3.currentProvider);
  //    console.log('Using Metamask...');
  //  } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
      console.log('Using Ganache...');
  //  }
  },

  initContracts: function () {
    $.getJSON('DappTokenSale.json', function (dappTokenSale) {
      App.contracts.DappTokenSale = TruffleContract(dappTokenSale);
      App.contracts.DappTokenSale.setProvider(App.web3Provider);
      App.contracts.DappTokenSale.deployed().then(function (dappTokenSale) {
        console.log('Dapp Token Sale Address:', dappTokenSale.address);
      });
    }).done(function () {
      $.getJSON('DappToken.json', function (dappToken) {
        App.contracts.DappToken = TruffleContract(dappToken);
        App.contracts.DappToken.setProvider(App.web3Provider);
        App.contracts.DappToken.deployed().then(function (dappToken) {
          console.log('Dapp Token Address:', dappToken.address);
        });
      });
    });
  },

  render: function () {
    if (App.loading) {
      return;
    }

    App.loading = true;

    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    // Load account data.
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $('#accountAddress').html('Your Account: ' + account);
      }
    });

    App.contracts.DappTokenSale.deployed().then(function (instance) {
      dappTokenSaleInstance = instance;
      return dappTokenSaleInstance.tokenPrice();
    }).then(function (tokenPrice) {
      App.tokenPrice = tokenPrice;
      $('.token-price').html(web3.fromWei(App.tokenPrice, 'ether').toNumber());
    });

    App.loading = false;
    loader.hide();
    content.show();
  },
};

window.onload = function () {
  App.init();
  App.initWeb3();
  App.initContracts();
  App.render();
};
