const sc = artifacts.require("HelloWorld");

module.exports = function(deployer) {
  deployer.deploy(sc);
};