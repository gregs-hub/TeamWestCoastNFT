require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: "0.8.13",
  networks: {
  	ropsten: {
  		url: `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`,
  		accounts: [`0x${process.env.PRIVATE_KEY}`]
  	}
  }
};