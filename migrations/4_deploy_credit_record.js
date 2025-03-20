const CreditRecord = artifacts.require("CreditRecord");

module.exports = function(deployer) {
  deployer.deploy(CreditRecord);
}; 