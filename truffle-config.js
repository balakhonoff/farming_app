//npm i dotenv
//gitignore .env
//create .env file
//npm install @truffle/hdwallet-provider
require('dotenv').config()
const HDWalletProvider = require("@truffle/hdwallet-provider")

require('babel-register');
require('babel-polyfill');

const private_keys = [
  process.env.PRIVATE_KEY_0,
  process.env.PRIVATE_KEY_1
]
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider({
        privateKeys: private_keys,
        providerOrUrl: process.env.RINKEBY_SERVER,
        numberOfAddresses: 2
      }),
      network_id: 4,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    mainnet: {
      provider: () => new HDWalletProvider(
        process.env.SECRET_KEY,
        process.env.ETHER_MAINNET_SERVER,
      ),
      network_id: 1,
      gas: 2000000,
      gasPrice:100000000000000,
      confirmations: 2,
      skipDryRun: true
    },
    mumbai: {
      provider: () => new HDWalletProvider({
        privateKeys: private_keys,
        providerOrUrl: process.env.MUMBAI_SERVER,
        numberOfAddresses: 2
      }),
      network_id: 80001,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "petersburg"
    }
  }
}
