import React, { Component } from "react";
import { connect } from "react-redux";
import { accountSelector } from "../store/selectors";


class Navbar extends Component {

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <a className="navbar-brand" href="/#">Dapp Token Exchange</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" 
            aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a className="nav-link small" 
                //   Link to ether scan for address, i'm assuming we can only do this with our actual metamask address
                    // Shows transactions of ether for account
                  href={`https://etherscan.io/address/${this.props.account}`}
                  target= "_blank"
                  rel="noopener noreferrer"
                  >
                    {/* show address dynamically on page using {} */}
                    {this.props.account}
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        )
    }
}

function mapStateToProps(state) {
    return {
      account: accountSelector(state)
    }
  }
  // Connects redux to component by both the mapStateToProps function and the connect() function import
  export default connect(mapStateToProps)(Navbar);