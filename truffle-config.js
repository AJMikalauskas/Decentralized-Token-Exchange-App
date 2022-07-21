require('babel-register');
require('babel-polyfill');
require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider-privkey');
const privateKeys = process.env.PRIVATE_KEYS || ""


module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    // public blockchain where ehter is worth nothing, cna deploy smart contracts to here
    kovan: {
      provider: function() {
        // HDWalletProvider is what generates a wllaet from private key(s) from accounts in ganache
        return new HDWalletProvider(
          // Private Key -> split the private keys by a comma -> array of account private keys
          privateKeys.split(','),
          // Url to an Ethereum Node
          `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
    },
  },
  // Redirects smart contracts to work in these 2 contract directories, 
  // done by running truffle compile in cmd terminal
  //  helpful to track tokens via frontend changes. by putting in src/abis 
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  // Set default mocha options here, use special reporters etc.
  // mocha: {
  //   // timeout: 100000
  // },

  // Configure your compilers
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
         runs: 200
      }
    }
  }
}
