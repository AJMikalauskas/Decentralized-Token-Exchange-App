import Web3 from 'web3';
import Token from '../abis/Token.json'
import Exchange from '../abis/Exchange.json'
import {
    web3Loaded,
    web3AccountLoaded,
    tokenLoaded,
    exchangeLoaded
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