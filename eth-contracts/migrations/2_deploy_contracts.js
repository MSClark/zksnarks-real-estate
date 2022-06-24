// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./SquareVerifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var RealEstateERC721Token = artifacts.require("./RealEstateERC721Token.sol");


module.exports = function(deployer) {
  deployer.deploy(RealEstateERC721Token);
  deployer.deploy(SquareVerifier).then(() => {
    return deployer.deploy(SolnSquareVerifier, SquareVerifier.address);
  });
};
