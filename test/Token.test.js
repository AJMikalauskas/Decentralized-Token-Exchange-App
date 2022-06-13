const Token = artifacts.require("./Token");

// Interesting way to import this
require("chai").use(require("chai-as-promised")).should();

contract("Token", (accounts) => {
  // These are values to compare against by chai equals()
  const name = "My Token Name";
  const symbol = "MTN";
  // decimals was also a string no jsut a number, make consistent with totalSupply
  const decimals = "18";
  // 24 0's are in this total supply, just going to use this for test, doesn't matter either way
  const totalSupply = "1000000000000000000000000";
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
  });
});
