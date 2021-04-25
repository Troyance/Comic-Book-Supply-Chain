// migrating the appropriate contracts
//var CreatorRole = artifacts.require("./CreatorRole.sol");
//var DistributorRole = artifacts.require("./DistributorRole.sol");
//var PublisherRole = artifacts.require("./PublisherRole.sol");
//var RetailerRole = artifacts.require("./RetailerRole.sol");
//var ConsumerRole = artifacts.require("./ConsumerRole.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  //deployer.deploy(CreatorRole);
  //deployer.deploy(PublisherRole);
  //deployer.deploy(DistributorRole);
  //deployer.deploy(RetailerRole);
  //deployer.deploy(ConsumerRole);
  deployer.deploy(SupplyChain);
};
