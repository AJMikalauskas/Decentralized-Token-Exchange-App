import {tokens, EVM_REVERT} from "./helpers.js";
const Token = artifacts.require("./Token");

// Interesting way to import this
require("chai").use(require("chai-as-promised")).should();

contract("Token", ([deployer, sender, receiver]) => {
  // These are values to compare against by chai equals()
  const name = "My Token Name";
  const symbol = "MTN";
  // decimals was also a string no jsut a number, make consistent with totalSupply
  const decimals = "18";
  // 24 0's are in this total supply, just going to use this for test, doesn't matter either way
  // replaced by tokens function above, times tokens passed in as param by 10 to power of 18
  const totalSupply = tokens(1000000)
  //const totalSupply = (1000000 * (10**decimals)).toString();
  let token;
  // 4 tests: name, symbol, decimals, total supply
  //mocha feature(beforeEach()) to get token by async await for every test shown below
  // can access token keyword in tests below due to it being defined globally above.
  beforeEach(async () => {
    token = await Token.new();
  });

  // function provided by testing framework, probably jest?
    // test that the token name is what is typed in Token.sol, not a method for it, he tested name
  describe("deployment", () => {
    it("tracks the address", async () => {
      // fetch smart contract deployed to blockchain, info given from token in truffle console
        // access name method(),may not have existed due to me migrating before making the name string public

      // Step 1, Fetch Token From Blockchain -> need async keyword with anonymous arrow function above
        // need await keyword when using smart contract method
            //const token = await Token.new()
      // Step 2, Acquire name() from name() method in methods {}
      //const tokenName = token.name();
      // Step 3, use chai assertion library to use expect,should, assert, etc to test it
      const resName = await token.name();
      resName.should.equal(name);
      // checks if token name from token returned aobve is equal to what we expect name to be in name const
      // run ganache and run truffle test in cmd line
    });

    // Test to track symbol, need to find way to access erc20 methods of .symbol(), .name(), .decimals(), .totalSupply()
      // I think I was able to do so by migrating with public name property? New migration of 3
    it("tracks the symbol", async () => {
      // Similar test but instead of .name(), uses .symbol()
      const resSymbol = await token.symbol();
      resSymbol.should.equal(symbol);
    });

    it("tracks the decimals", async () => {
      // Similar test but instead of .name(), uses .decimals()
      const resDecimal = await token.decimals();
      resDecimal.toString().should.equal(decimals);
    });

    it("tracks the total supply", async () => {
      // Similar test but instead of .name(), uses .totalSupply()
      const resSupply = await token.totalSupply();
      resSupply.toString().should.equal(totalSupply);
    });

    it('balanceOf is equal to total supply', async () => {
      // deployer is passed as param of contract() method test above;
        // Can have multiple values in the array that is the params;
          // may eventually add sender and receiver to that array; obviously used 
            // in different context.
      const resultBalance = await token.balanceOf(deployer);
      resultBalance.toString().should.equal(totalSupply)
    })
  });

  describe('sending tokens', () => {
    let amount
    let result

    describe('success', async () => {
    beforeEach(async () => {
            // Transfer method -> Transfer
        // 3rd param is metadata specifying where the tokens are coming from
        // sets the msg.from to deployer, example is msg.sender in Token.sol
        amount = tokens(100);
        result = await token.transfer(receiver,amount, {from: deployer});
    })

    it('transfer() method transfers token balances', async () => {
      // Just to see whats happening with the balanceOf for the receiver; log first, no run test
     
      //Before Transfer
      // let balanceOf
      // balanceOf = await token.balanceOf(receiver)
      // console.log("receiver balance before transfer",balanceOf.toString());
      // balanceOf = await token.balanceOf(deployer)
      // console.log("deployer balance before transfer",balanceOf.toString());

      //After Transfer
      let balanceOf
      balanceOf = await token.balanceOf(receiver)
     // console.log("receiver balance after transfer",balanceOf.toString());
      balanceOf = await token.balanceOf(deployer)
     // console.log("deployer balance after transfer",balanceOf.toString());
      balanceOf.toString().should.equal(tokens(999900));
    })

    it('emits a Transfer event', async () => {
      
      // Logs shows the event that occurred and the from/to address + value being transferred
      // console.log(result.logs);

      // Run test to make sure that logs event is Transfer
      const log = result.logs[0];
      log.event.should.equal("Transfer");
      console.log(result.logs[0]);

      const argsObj = log.args;
      argsObj.from.should.equal(deployer, 'from is correct');
      argsObj.to.should.equal(receiver,'to is correct');
      // Make sure to convert value to string because it's the only way the BN number
        // becomes a readable format, changes from tokens(100)
          // 2nd param in .equal() is helpful to know exactly where an error occurred for you
      argsObj.value.toString().should.equal(amount,'value transferred is correct');
      console.log(tokens(100));
      console.log(argsObj.value.toString())
  })
})

describe('failure', async() => {
  it('rejects insufficient funds', async () => {
    // Should Pass This -> Tests transfer from deployer to receiver, deployer curAmt = 1 Million
    let invalidAmount = tokens(100000000) // This is 100 million which even the deployer
      // who has a million can't send, greater than total supply
      await token.transfer(receiver,invalidAmount,{ from:deployer }).should.be
        .rejectedWith(EVM_REVERT)
        // Moved exception error to helpers.js

    // Should Pass This -> Tests transfer from receiver to deployer, receiver curAmt = 0
     invalidAmount = tokens(10) 
      await token.transfer(deployer,invalidAmount,{ from:receiver }).should.be
        .rejectedWith(EVM_REVERT)
    })
    // Test for invalid recipient by using correctly formatted address such as 0x0,
      // a good test
    it('rejects invalid recipient', async() => {
      await token.transfer(0x0, amount, {from:deployer}).should.be.rejected
    })
})
  })
});
