import React, { Component } from 'react';
import './App.css';
//import Web3 from 'web3';
//import Token from '../abis/Token.json'
import { loadAccount, loadExchange, loadToken, loadWeb3 } from '../store/interactions';
import { connect } from 'react-redux';

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

            // https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#eth-contract 
            //Dig into abi and within abi find network and within network, find address networkId is seen in Ganache as 5777
              // will add null and undefined checks to networkId later so it doesn't bug out if networkId is faulty.
              // This overall helps access values within the Token smart contract such as total supply below
             // console.log(Token.abi)
              //console.log(Token.networks[networkId]);
            //const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
            const token = await loadToken(web3,networkId,dispatch);
            console.log("token",token)
            const totalSupply = await token.methods.totalSupply().call()
            console.log("totalSupply", totalSupply)

            // load exchange smart contract in same way as token in interactions.js
            const exchange = await loadExchange(web3,networkId,dispatch)
            console.log("exchange", exchange)
          }
  
  render() {
    return (
      <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="/#">Navbar</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/#">Link 1</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#">Link 2</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#">Link 3</a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="content">
        <div className="vertical-split">
          <div className="card bg-dark text-white">
            <div className="card-header">
              Card Title
            </div>
            <div className="card-body">
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="/#" className="card-link">Card link</a>
            </div>
          </div>
          <div className="card bg-dark text-white">
            <div className="card-header">
              Card Title
            </div>
            <div className="card-body">
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="/#" className="card-link">Card link</a>
            </div>
          </div>
        </div>
        <div className="vertical">
          <div className="card bg-dark text-white">
            <div className="card-header">
              Card Title
            </div>
            <div className="card-body">
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="/#" className="card-link">Card link</a>
            </div>
          </div>
        </div>
        <div className="vertical-split">
          <div className="card bg-dark text-white">
            <div className="card-header">
              Card Title
            </div>
            <div className="card-body">
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="/#" className="card-link">Card link</a>
            </div>
          </div>
          <div className="card bg-dark text-white">
            <div className="card-header">
              Card Title
            </div>
            <div className="card-body">
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="/#" className="card-link">Card link</a>
            </div>
          </div>
        </div>
        <div className="vertical">
          <div className="card bg-dark text-white">
            <div className="card-header">
              Card Title
            </div>
            <div className="card-body">
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="/#" className="card-link">Card link</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}


function mapStateToProps() {
  return {

  }
}
// Connects redux to component by both the mapStateToProps function and the connect() function import
export default connect(mapStateToProps)(App);
