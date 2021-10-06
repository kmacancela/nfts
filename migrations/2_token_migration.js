// import our Date solidity file
const DateToken = artifacts.require("Date");

// export a function that calls the deployer to deploy  our Date token
module.exports = function (deployer) {
  deployer.deploy(DateToken);
};
