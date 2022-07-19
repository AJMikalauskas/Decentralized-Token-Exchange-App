import Web3 from 'web3';
import Token from '../abis/Token.json'
import Exchange from '../abis/Exchange.json'
import {
    web3Loaded,
    web3AccountLoaded,
    tokenLoaded,
    exchangeLoaded,
    cancelledOrdersLoaded, 
    filledOrdersLoaded,
    allOrdersLoaded,
    orderCancelling,
    orderCancelled
}
from "./actions";

export const loadWeb3 = async (dispatch) => {
    //window.ethereum replaces .givenProvider() that he uses
    if(typeof window.ethereum!=='undefined'){
      const web3 = new Web3(window.ethereum)
      dispatch(web3Loaded(web3))
      return web3
    } else {
        // cannot use above functionality if metamask not installed?
      window.alert('Please install MetaMask')
      window.location.assign("https://metamask.io/")
    }
}

export const loadAccount = async (web3, dispatch) => {
    // acts as what we did in App.js in loadBlockchainData() method
    const accounts = await web3.eth.getAccounts()
    //gets the current Account logged in via metamask, the address of it I think.
    const account = await accounts[0]
    if(typeof account !== 'undefined'){
        //Only dispatches action if the account exists and isn't undefined; if account not exist, asks you to log into metamask account address
      dispatch(web3AccountLoaded(account))
      return account
    } else {
      window.alert('Please login with MetaMask')
      return null
    }
  }

  //Loads token smart contract -> similar to way we did it in App.js
  export const loadToken = async (web3, networkId, dispatch) => {
    try {
      const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
      dispatch(tokenLoaded(token))
      return token
    } catch (error) {
      console.log('Contract not deployed to the current network. Please select another network with Metamask.')
      return null
    }
  }

  //Loads Exchange smart contract -> similar to way we did token contract above.
  export const loadExchange = async (web3, networkId, dispatch) => {
    try {
      const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address)
      dispatch(exchangeLoaded(exchange))
      return exchange
    } catch (error) {
      console.log('Contract not deployed to the current network. Please select another network with Metamask.')
      return null
    }
  }

  export const loadAllOrders = async (exchange,dispatch) => {
    // Fetch cancelled orders with the "Cancel" event stream
        // 2nd param is the options of where the checkks for the cancel evnt on the blockchian is happening, checks all over the blockchain
            // but could specify specific blocks on blockchain if wanted.
    const cancelStream = await exchange.getPastEvents("Cancel", { fromBlock: 0, toBlock: 'latest' });
    // Format cancelled orders -> return only: amountGet, amountGive, id, timestamp, tokenGet, and tokenGive -> These are found in 
        // returnValues object inside cancelStream, for when there is future cancelled order, use map()
            // returns the values we need and can access by index(0-5) or by names mentioned above.
    const cancelledOrders = cancelStream.map((event) => event.returnValues)
    console.log(cancelledOrders);
    // Create action of cancelledOrders and dispatch action while passing in filtered cancelledOrders info from cancelStream.
    dispatch(cancelledOrdersLoaded(cancelledOrders))


    // Fetch filled orders with the "Trade" event stream -> similar to cancelled, not just 1, there are 3 filled orders
    const tradeStream = await exchange.getPastEvents("Trade", { fromBlock: 0, toBlock: 'latest'});
    // Format filled orders
    const filledOrders = tradeStream.map((event) => event.returnValues);
    console.log(filledOrders);
    // create an action for filledOrders and dispatch action in filtered filledOrders info from filledStream
    dispatch(filledOrdersLoaded(filledOrders))

    // Fetch all orders with the "Order" event stream, calculated by subtracting filled and cancelled orders.
    const orderStream = await exchange.getPastEvents("Order", { fromBlock: 0, toBlock: 'latest'});
    // Format order stream
    const allOrders = orderStream.map((event) => event.returnValues);
    console.log(allOrders)
    // create an action for allOrders and dispatch action in filtered allOrders info from orderStream
    dispatch(allOrdersLoaded(allOrders));
  }

export const cancelOrder = (dispatch, exchange, order, account) => {
  // Call cancelOrder function from the exchange smart contract
    // Use the 4 params above to put in web3 methods such as .send() -> send methods will require you to create transactions
      // which can be made here but on the blockchain smart contract
      // Follow documentation: https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#methods-mymethod-send 
      // exchange is the contract in which method we're trying to use, cancelOrder is the method in which we're using
      // order.id is the param to use for the id param from exchange smart contract cancelOrder() method
      // account is the current metamask address. 
  exchange.methods.cancelOrder(order.id).send({from : account})
  .on('transactionHash', (hash) => {
    // This is an async function call, handle by .on() event emitter
    // waits for transactionHash to come back from the blockchain before a redux action is triggered that the order 
    // is cancelling
    // Dispatch action here 
      // 2 events of both cancellingOrder() and fully having a cancelledOrder() once the Cancel event is emitted on blockchain.
    dispatch(orderCancelling())
  })
  .on('error', (error) => {
    // Handle any errors that result from .send() method
    console.log(error);
    window.alert('There was an error!')
  })
}

export const subscribeToEvents = async(dispatch, exchange) => {
  // follow this documentation: https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#contract-events 
    // No options and 2nd param is the callback which is an anonymous arrow function that will use error and event
      // Dispatches orderCancelled event which will have the event.returnValues seen in the action or in reducers.js 
  exchange.events.Cancel({}, (error, event) => {
    console.log(event.returnValues)
    dispatch(orderCancelled(event.returnValues))
  })
}
