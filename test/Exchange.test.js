import {tokens, EVM_REVERT} from "./helpers.js";
const Exchange = artifacts.require("./Exchange");
const Token = artifacts.require('./Token')

// Imports this way due to test whil importing
require("chai").use(require("chai-as-promised")).should();
contract("Exchange", ([deployer, feeAccount, user1]) => {
  // initializing token let or variable
  let token
  let exchange;
  const feePercent = 10;
  beforeEach(async () => {
    // deploy token.sol contract
    token = await Token.new()
        // transfer tokens to user1 so that error won't result on deposit of tokens
      // receives tokens from deployer; deployer has all tokens when this token is deployed onto blockchain
     token.transfer(user1, tokens(100), {from : deployer})
    // by putting feeAccount into Exchange.new() 
    // it passes it into the constructor of the Exchange.sol smart contract
      // Deploy exchange.sol
    exchange = await Exchange.new(feeAccount, feePercent);
  });

  // Assign fee account and check that it was set Tests
  describe("deployment", () => {
    it("tracks the fee account", async () => {
        // need to create feeAccount in Exchange.sol constructor now
        // tests against feeAcount in params above
      const result = await exchange.feeAccount();
      result.should.equal(feeAccount);
    });

    // Similar to above test except a uint256 not an address
    it("tracks the fee account", async () => {
      const result = await exchange.feePercent();
      result.toString().should.equal(feePercent.toString());
    });
  });


    // Depositing Tokens Test
    describe("depositing tokens", () => {
      let result
      // for more accessibility of the tokens(10) and not repeating everytime, created amount let variable
      let amount = tokens(10);
// write beforeEach() that approves the tokens to be EXCHANGED ON THE EXCHANGE
    // approve takes in two params; 1st param is the spender and the 2nd param is the number of tokens uint256
beforeEach(async() => {
  // didn't know the exchange.address existed, so just logging to console to see it.
  console.log(exchange.address);
  // user1 is another address in the contract array of addresses above. Only sent in as metadata for now
    // user1 address receives 100 tokens from the deployer who owns all the tokens
      // metadata is important here, because the from whether it be deployer or user1 address has the approved tokens
        // while the address nto there doesn' have approved tokens 
  await token.approve(exchange.address, amount, { from : user1});
  // exchange address receives the tokens(10) from user1
    // this is more explainable when looking at Exchange.sol smart contract, exchange receives the tokens 
      // from what address is in the metadata; the msg.sender is the from metadata address ->
        // whoever has the approved tokens is the only address that can deposit tokens to the exchange
  result = await exchange.depositToken(token.address,amount, { from: user1});
  console.log(user1);
})
      describe('success', () => {
          it('tracks the token deposit', async() => {
            // Check Exchange token balance
            let balance 
            balance = await token.balanceOf(exchange.address);
            balance.toString().should.equal(amount.toString())
            //Check tokens on exchange
            balance = await exchange.tokens(token.address, user1);
            balance.toString().should.equal(amount.toString());
          })

          it('emits a Deposit event', async () => {

            // Run test to make sure that logs event is Transfer
            const log = result.logs[0];
            log.event.should.equal("Deposit");
            console.log(result.logs[0]);
      
            // adjust to fit 4 params passed in Deposit event in Exchange.sol
            const argsObj = log.args;
            // token is an object so make sure to use property address of the token
           argsObj.token.should.equal(token.address, 'token is correct');
           argsObj.user.should.equal(user1,'user is correct');
           // Since these are returned as BN format, convert toString() so that they become normal and not weirdly formatted
           argsObj.amount.toString().should.equal(amount.toString(),'amount is correct');
           argsObj.balance.toString().should.equal(amount.toString(),'balance is correct');
            console.log(argsObj);
            //argsObj.value.toString().should.equal(amount,'value transferred is correct');
        })
      })

      describe('failure', () => {

      })
    });

});