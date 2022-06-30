import React, { Component } from 'react';
import './App.css';
//import Web3 from 'web3';
//import Token from '../abis/Token.json'
import { loadAccount, loadExchange, loadToken, loadWeb3 } from '../store/interactions';
//import { accountSelector } from '../store/selectors';
import { connect } from 'react-redux';
import Navbar from './Navbar';
import Content from './Content';
import { contractsLoadedSelector } from '../store/selectors';

class App extends Component {
          //React lifecycle method 
      // do something in here that will do before the component is mounted to the DOM
      // ComponentWillMount() deprecated, replace by componentDidMount() -> this new componentDidMount() is called after the component mounted
        // what to do??? -> I just used the deprecated componentWillMount() and called loadBlockchainData.
        componentDidMount(){
          this.loadBlockchainData(this.props.dispatch)
        };


        // Need to add Ganache Network to Metamask via ->  https://dapp-world.com/blogs/01/how-to-connect-ganache-with-metamask-and-deploy-smart-contracts-on-remix-without-1619847868947#:~:text=Connection%20of%20Ganache%20with%20Metamask%20%3A&text=Open%20Metamask%20and%20go%20to,ID%20for%20ganache%20is%201337 
        // Import Account from Ganache by Import Account In Metamask using private key
        async loadBlockchainData(dispatch) {
          // use the given provider, e.g. in the browser with metmask or other websocket such as from ganache?
            // Copied code from github help
              // Replace with Redux dispatched actions
            const web3 = await loadWeb3(dispatch)
            window.ethereum.enable().catch(error => {  console.log(error) })
            console.log("web3", web3);
            // Detect nework we're connected to by getId(), getNetworkType() deprecated -> can handle promise chain
              // by .then() or just using await keyword. Gets network id not network specifically and can test via metamask changing networks
            const networkId = await web3.eth.net.getId()
            console.log("networkId", networkId);
            // Get first account from array of accounts returned  -> do so by console logging accounts, if multiple, use [0]  
            // Will return account(s) allowed by metamask notification to be in ganache network -> should be 2 including my own and
            // the account imported from ganache -> only shows account address that is currently selected in metamask
              // Add into actions.js, reducers.js and interactions.js for Redux.
          const accounts = await loadAccount(web3, dispatch);
            console.log("accounts", accounts)
                // Console logs default value for get on original render and then calls method above and gets account and diplays in console correctly
      // even after falsely displaying value, will now dispaly account address correctly. 
    console.log(this.props.account) 

            // https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#eth-contract 
            //Dig into abi and within abi find network and within network, find address networkId is seen in Ganache as 5777
              // will add null and undefined checks to networkId later so it doesn't bug out if networkId is faulty.
              // This overall helps access values within the Token smart contract such as total supply below
             // console.log(Token.abi)
              //console.log(Token.networks[networkId]);
            //const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
            const token = await loadToken(web3,networkId,dispatch);
            console.log("token",token)
            // if loadToken runs into error or catch and returns null
            if(!token) {
              window.alert('Token smart contract not detected on the current network. Please select another network within Metamask.')
            }
            // const totalSupply = await token.methods.totalSupply().call()
            // console.log("totalSupply", totalSupply)

            // load exchange smart contract in same way as token in interactions.js
            const exchange = await loadExchange(web3,networkId,dispatch)
            console.log("exchange", exchange)
            // if loadToken runs into error or catch and returns null
            if(!exchange) {
              window.alert('Exchange smart contract not detected on the current network. Please select another network within Metamask.')
            }
          }
  
  render() {
    return (
      <div>
        <Navbar/>
        {/* JSX conditional to only show content if smart contracts of exchange and token are loaded. */}
         { this.props.contractsLoaded ?  <Content/> : <div className='content'></div>}
    </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    contractsLoaded: contractsLoadedSelector(state)
  }
}
// Connects redux to component by both the mapStateToProps function and the connect() function import
export default connect(mapStateToProps)(App);
