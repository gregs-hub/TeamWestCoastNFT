require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: "0.8.13",
  // paths: {
  //   artifacts: "./artifacts",
  //   sources: "./contracts",
  //   cache: "./cache",
  //   tests: "./test"
  // },
  networks: {
    hardhat: {
      // In this case, a new block will be mined after a random delay of between 3 and 6 seconds.
      mining: {
        auto: false,
        interval: [3000, 6000],
      },
    },
	// ganache: {
	// 	url: "http://127.0.0.1:8545",
	// 	accounts: [`${process.env.PRIVATE_KEY_GANACHE1}`, `${process.env.PRIVATE_KEY_GANACHE2}`]
	// },
  	ropsten: {
  		url: `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`,
  		accounts: [`${process.env.PRIVATE_KEY}`]
  	}
  }
};