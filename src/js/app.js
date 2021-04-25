App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    CreatorID: "0x0000000000000000000000000000000000000000",
    CreatorName: null,
    productNotes: null,
    productPrice: 0,
    publisherID: "0x0000000000000000000000000000000000000000",
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.CreatorID = $("#CreatorID").val();
        App.CreatorName = $("#CreatorName").val();
        App.productNotes = $("#productNotes").val();
        App.rightsPrice = $("#rightsPrice").val();
        App.productPrice = $("#productPrice").val();
        App.retailPrice = $("retailPrice").val();
        App.publisherID = $("#publisherID").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID,
            App.CreatorID,
            App.CreatorName,
            App.productNotes,
            App.rightsPrice,
            App.productPrice,
            App.retailPrice,
            App.publisherID,
            App.distributorID,
            App.retailerID,
            App.consumerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';

        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);

            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.createItem(event);
                break;
            case 2:
                return await App.sellItemRights(event);
                break;
            case 3:
                return await App.buyItemRights(event);
                break;
            case 4:
                return await App.printItem(event);
                break;
            case 5:
                return await App.sellItem(event);
                break;
            case 6:
                return await App.buyItem(event);
                break;
            case 7:
                return await App.processItem(event);
                break;
            case 8:
                return await App.packageItem(event);
                break;
            case 9:
                return await App.shipItem(event);
                break;
            case 10:
                return await App.receiveItem(event);
                break;
            case 11:
                return await App.stockItem(event);
                break;
            case 12:
                return await App.purchaseItem(event);
                break;
            case 13:
                return await App.fetchItemBufferOne(event);
                break;
            case 14:
                return await App.fetchItemBufferTwo(event);
                break;
            }
    },

    createItem: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.createItem(
                App.upc,
                App.metamaskAccountID,
                App.CreatorName,
                App.productNotes
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('createItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sellItemRights: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const productPrice = web3.utils.toWei('.5', 'ether');
            console.log('rightsPrice',rightsPrice);
            return instance.sellItemRights(App.upc, App.rightsPrice, { from: App.metamaskAccountID });
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sellItemRights',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    buyItemRights: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const pWalletValue = web3.utils.toWei('100', 'ether');
            return instance.buyItemRights(App.upc, { from: App.metamaskAccountID, value: pWalletValue });
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('buyItemRights',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    printItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.printItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('printItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sellItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
          const productPrice = web3.utils.toWei('1', 'ether');
          return instance.sellItem(App.upc, App.productPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sellItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    buyItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const rWalletValue = web3.utils.toWei('100', 'ether');
            return instance.buyItem(App.upc, {from: App.metamaskAccountID, value: rWalletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('buyItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    processItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.processItem(App.upc, { from: App.metamaskAccountID });
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('processItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    packageItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packageItem(App.upc, { from: App.metamaskAccountID });
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('packageItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    shipItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipItem(App.upc, { from: App.metamaskAccountID });
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('shipItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItem(App.upc, { from: App.metamaskAccountID });
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('receiveItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    stockItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
          const retailPrice = web3.utils.toWei('1.5', 'ether');
          return instance.stockItem(App.upc, App.retailPrice, { from: App.metamaskAccountID });
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('stockItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            cWalletValue = web3.utils.toWel('5', 'ether');
            return instance.purchaseItem(App.upc, {from: App.metamaskAccountID, value: cWalletValue });
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('purchaseItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchItemBufferOne: function () {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferOne', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferTwo', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });

    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
