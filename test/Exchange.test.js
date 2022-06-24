import {tokens, EVM_REVERT, ETHER_ADDRESS, ether} from "./helpers.js";
const Exchange = artifacts.require("./Exchange");
const Token = artifacts.require('./Token')

// Imports this way due to test whil importing
require("chai").use(require("chai-as-promised")).should();
contract("Exchange", ([deployer, feeAccount, user1, user2]) => {
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

  // This is to test the fallback function in Exchange.sol
    // falls back if Ether is sent to Exchange.sol smart contract by mistake
    // fallback function is called only if the method you're calling in a smart contract doesn't exist
      // sendTransaction doesn't exist in exchange so fallbakc function is called instead
  describe('fallback', () => {
    it('reverts when Ether is sent', async () => {
      await exchange.sendTransaction({value: ether(1), from: user1}).should.be.rejectedWith(EVM_REVERT);
    })
  })

  describe('depositing Ether', async() => {
    let result
    let amount = ether(1);

    beforeEach(async () => {
      // ether method is in helpers.js and is the exact same as tokens method; similar wei conversion with 10 to the power of 18
      result = await exchange.depositEther({ from: user1, value: amount})
    })

    it('tracks the Ether deposit', async () => {
      const balance = await exchange.tokens(ETHER_ADDRESS, user1) 
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
     argsObj.token.should.equal(ETHER_ADDRESS, 'ether address is correct');
     argsObj.user.should.equal(user1,'user is correct');
     // Since these are returned as BN format, convert toString() so that they become normal and not weirdly formatted
     argsObj.amount.toString().should.equal(amount.toString(),'amount is correct');
     argsObj.balance.toString().should.equal(amount.toString(),'balance is correct');
      console.log(argsObj);
      //argsObj.value.toString().should.equal(amount,'value transferred is correct');
  })
  })

  describe('withdrawing Ether', async() => {
    let result
    let amount = ether(1);
    // This allows you to subtract ether from token mapping of ether since there is now actually a balance of ether
    beforeEach(async() => {
      result = await exchange.depositEther({from: user1, value: amount})
    })
    describe('success', async() => {
      // withdraws ether for test below to check tokens mapping ether balance
      beforeEach(async() => {
        result = await exchange.withdrawEther(amount, {from: user1})
      })
      // should equal 0 since both deposited 1 ether and subtracted 1 ether
      it('withdraws Ether funds', async() => {
        const balance = await exchange.tokens(ETHER_ADDRESS, user1);
        balance.toString().should.equal('0');
      })

      it('emits a Withdraw event', async () => {
        const log = result.logs[0];
        log.event.should.equal("Withdraw");
        console.log(result.logs[0]);
  
        // adjust to fit 4 params passed in Withdraw event in Exchange.sol
        const argsObj = log.args;
        // token param should be the ether address
       argsObj.token.should.equal(ETHER_ADDRESS, 'ether address is correct');
       argsObj.user.should.equal(user1,'user is correct');
       // Since these are returned as BN format, convert toString() so that they become normal and not weirdly formatted
       argsObj.amount.toString().should.equal(amount.toString(),'amount is correct');
       argsObj.balance.toString().should.equal('0','balance is correct');
        console.log(argsObj);
        //argsObj.value.toString().should.equal(amount,'value transferred is correct');
    })
    })

    describe('failure', () => {
      it('rejects withdraws for insufficient balances', async() => {
        //expect this to fail beacuse trying to withdraw more than a user has
        await exchange.withdrawEther(ether(100), {from: user1}).should.be.rejectedWith(EVM_REVERT);
      })
    })
  })

    // Depositing Tokens Test
    describe("depositing Tokens", () => {
      let result
      // for more accessibility of the tokens(10) and not repeating everytime, created amount let variable
      let amount = tokens(10);
      describe('success', () => {
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
        it('rejects Ether Deposits', async() => {
          // Similar to test below except for passing in ETHER address as the token address
            // Making ETHER_ADDRESS reusable so we put it into helpers.js
          await exchange.depositToken(ETHER_ADDRESS,tokens(10), {from : user1}).should.be.rejectedWith(EVM_REVERT);
        })
        // Moved beforeEach() into describe('success') so that approval of tokens wouldn't happen and instead 
          // would allow this test to pass due to beforeEach() not being global.
        it('fails when no tokens are approved', async() => {
          // Don't approve tokens before depositing
          await exchange.depositToken(token.address, tokens(10), {from: user1}).should.be.rejectedWith(EVM_REVERT);
        })
      })
    });

    describe('withdrawing Tokens', () => {
      let result
      // for more accessibility of the tokens(10) and not repeating everytime, created amount let variable
      let amount = tokens(10);

      // // This approves tokens so that they can be withdrawn even in fail cases; fail cases should be chai asserted just so they
      //   // don't fail because of invalid amount only
      // beforeEach(async() => {
      //     // Explanation of this in depositing Tokens test
      //     await token.approve(exchange.address, amount, { from : user1});
      //     await exchange.depositToken(token.address,amount, { from: user1});
      // })

      describe('success', async() => {
        beforeEach(async() => {
                    // Explanation of this in depositing Tokens test
                    await token.approve(exchange.address, amount, { from : user1});
                    await exchange.depositToken(token.address,amount, { from: user1});
          // set result equal to result of withdrawingTokens method not the depositToken as this is testing the withdrawal of tokens
          result = await exchange.withdrawToken(token.address,amount,{from : user1})
        })
        it('withdraws token funds', async () => {
          // Approves/Deposits and Withdraws Tokens above -> Adds 10 tokens and also removes 10 tokens -> should result in 0 being the 
            // value for the tokens mapping of the tokens fo the specific user address. User still has tokens but not on the exchange.
          const balance = await exchange.tokens(token.address, user1);
          balance.toString().should.equal('0');
        })

        it('emits a Withdraw event', async () => {
          const log = result.logs[0];
          log.event.should.equal("Withdraw");
          console.log(result.logs[0]);
    
          // adjust to fit 4 params passed in Withdraw event in Exchange.sol
          const argsObj = log.args;
         argsObj.token.should.equal(token.address, 'token address is correct');
         argsObj.user.should.equal(user1,'user is correct');
         // Since these are returned as BN format, convert toString() so that they become normal and not weirdly formatted
         argsObj.amount.toString().should.equal(amount.toString(),'amount is correct');
         argsObj.balance.toString().should.equal('0','balance is correct');
          console.log(argsObj);
      })
      })

      describe('failure', async() => {
        // Due to the ether require() check being first, this will fail on the ether and not on the tokens being invalid
          // even though it would fail on both because there are no tokens being added anywhere for these failure cases
        it('rejects Ether withdraws', async () => {
          await exchange.withdrawToken(ETHER_ADDRESS, tokens(10), {from : user1}).should.be.rejectedWith(EVM_REVERT)
        })

        // Should naturally fail because no tokens are in the specific user address
        it('fails for insufficient balances', async() => {
          await exchange.withdrawToken(token.address, tokens(10), {from : user1}).should.be.rejectedWith(EVM_REVERT)
        })
      })
    })

    describe('checking balances', () =>{ 
      let amount = 10
      let result 
      it('returns user ether balance', async() => {
        exchange.depositEther({from: user1, value: ether(amount)})
        result = await exchange.balanceOf(ETHER_ADDRESS, user1)
        result.toString().should.equal(ether(amount).toString());
      })

      it('returns user tokens balance', async() =>{
        await token.approve(exchange.address, tokens(amount), { from : user1});
        await exchange.depositToken(token.address,tokens(amount), { from: user1});
        result = await exchange.balanceOf(token.address, user1)
        result.toString().should.equal(tokens(amount).toString());
      })
    })

    // These tests are actually very minimal and only test if properties of the makeOrder order
      // are equal to values we expect. We'd need to actually deposit ether into the user's tokens mapping for them 
        // to even have a valid order to make? As done in cancel order tests?
    describe('making orders', () => {
      let result
      beforeEach(async () => {
        // Make order from user1 user to get 1 of our token by giving 1 ether.
        result = await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), {from : user1})
      })

      // This 1st test is to track if the orderCount/id is correct value of 1 after makeOrder is called once
        // tracks overall order by calling .orders() -> track properties within order by first accessing the order
      it('tracks the newly created order', async() => {
        const orderCount = await exchange.orderCount();
        orderCount.toString().should.equal('1');
        //accessing single order created above
        const order = await exchange.orders('1');
        // Test if id is equal to 1 as string, test if user is equal to user1, test if tokenGet is equal to token.address, 
        // test if amounGet is equal to tokens(1) toString(), tokenGive is equal to ether address, 
        // amountGive is equal to ether(1) toString(), and finally to check if timestamp is at least greater than 1.
        order.id.toString().should.equal('1', 'id is correct');
        order.user.should.equal(user1, 'user is correct');
        order.tokenGet.should.equal(token.address, 'tokenGet is correct');
        order.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct');
        order.tokenGive.should.equal(ETHER_ADDRESS, "tokenGive is correct");
        order.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct');
        order.timestamp.toString().length.should.be.at.least(1, 'timestamp is present');
      })

      it('emits a Order event', async () => {
        const log = result.logs[0];
        log.event.should.equal("Order");
        console.log(result.logs[0]);
  
        // adjust to fit 4 params passed in Order event in Exchange.sol
        const argsObj = log.args;
        argsObj.id.toString().should.equal('1', 'id is correct');
        argsObj.user.should.equal(user1, 'user is correct');
        argsObj.tokenGet.should.equal(token.address, 'tokenGet is correct');
        argsObj.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct');
        argsObj.tokenGive.should.equal(ETHER_ADDRESS, "tokenGive is correct");
        argsObj.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct');
        argsObj.timestamp.toString().length.should.be.at.least(1, 'timestamp is present');

        console.log(argsObj);
    })
    })

    describe('order actions', async () => {
      beforeEach(async() => {
        // user1 despoits ether
        await exchange.depositEther({ from: user1, value: ether(1)})
        // user1 makes an order to buy tokens with Ether
        await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), {from: user1})
      })

      describe('cancelling orders', async() => {
        let result

        describe('success', async () => {
          beforeEach(async () =>{
            // cancels order using id from makeOrder above
            result = await exchange.cancelOrder('1', {from: user1})
          })

          it('updates cancelled orders', async() => {
            // checks if mapping of ordersCancelled with correct id is equal to true; should be true if the order is cancelled from calling
              // shown above in beforeEach()
            const orderCancelled = await exchange.ordersCancelled(1);
            orderCancelled.should.equal(true)
          })

          it('emits a Cancel event', async () => {
            const log = result.logs[0];
            log.event.should.equal("Cancel");
            console.log(result.logs[0]);
      
            // adjust to fit 7 params passed in Cancel event in Exchange.sol
            const argsObj = log.args;
            argsObj.id.toString().should.equal('1', 'id is correct');
            argsObj.user.should.equal(user1, 'user is correct');
            argsObj.tokenGet.should.equal(token.address, 'tokenGet is correct');
            argsObj.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct');
            argsObj.tokenGive.should.equal(ETHER_ADDRESS, "tokenGive is correct");
            argsObj.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct');
            argsObj.timestamp.toString().length.should.be.at.least(1, 'timestamp is present');
    
            console.log(argsObj);
        })
        })
        describe('failure', async() => {
          // Cannot cancel an order that doesn't exist -> should only be one order from makeOrder above not 9999 invalid id
          it('rejects invalid order ids', async() =>{
            const invalidOrderId = 9999;
            await exchange.cancelOrder(invalidOrderId, {from: user1}).should.be.rejectedWith(EVM_REVERT);
          })

          // user2 shouldn't be able to cancel an order that user1 made
          it('rejects unauthorized cancellations', async () => {
            await exchange.cancelOrder('1', {from: user2}).should.be.rejectedWith(EVM_REVERT);
          })
        })
      })
    })
});