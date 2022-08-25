require('babel-register');
require('babel-polyfill');
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
//const MNEMONIC = '9a17e148f3874f608bdf112062e386b3';
const privateKeys = process.env.PRIVATE_KEYS || "";
const infuraKey = "6902d8dce8dc49508dad8009b98ad47f";

const fs = require("fs");
//patrol ticket vacuum duty frost ritual century explain suspect champion olympic rocket?
const mnemonic = fs.readFileSync(".secret").toString().trim();


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
     network_id: "*"       // Any network (default: none)
    // websockets: true
    },
    // public blockchain where ehter is worth nothing, cna deploy smart contracts to here
    ropsten: {
      provider: () =>  
        // HDWalletProvider is what generates a wllaet from private key(s) from accounts in ganache
          new HDWalletProvider(
          // Private Key -> split the private keys by a comma -> array of account private keys
         privateKeys.split(','),
          //API KEY SECRET
          //MNEMONIC,
          //mnemonic,
          // Url to an Ethereum Node
         `wss://ropsten.infura.io/ws/v3/${infuraKey}`
        ),
      network_id: 3,
     gas: 5000000,
     gasPrice: 25000000000, 
      confirmations: 2,
      timeoutBlocks: 20000,
      skipDryRun: true,
      websocket: true,
      //timeoutBlocks: 50000,
      networkCheckTimeout: 100000000
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
