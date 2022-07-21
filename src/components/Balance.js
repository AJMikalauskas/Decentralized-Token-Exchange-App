import React, { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { connect } from "react-redux";
import { depositEther, loadBalances, withdrawEther, depositToken, withdrawToken } from "../store/interactions";
import {
  web3Selector,
  exchangeSelector,
  tokenSelector,
  accountSelector,
  etherBalanceSelector,
  tokenBalanceSelector,
  exchangeEtherBalanceSelector,
  exchangeTokenBalanceSelector,
  balancesLoadingSelector,
  etherDepositAmountSelector,
  etherWithdrawAmountSelector,
  tokenDepositAmountSelector,
  tokenWithdrawAmountSelector
} from "../store/selectors";
import { etherDepositAmountChanged, etherWithdrawAmountChanged, 
    tokenDepositAmountChanged, tokenWithdrawAmountChanged } from "../store/actions";
import Spinner from "./Spinner";

const showForm = (props) => {
  // These are all props and can object destructure or extract them here
  const {
    etherBalance,
    tokenBalance,
    exchangeEtherBalance,
    exchangeTokenBalance,
    dispatch,
    etherDepositAmount,
    exchange,
    token,
    account,
    web3,
    etherWithdrawAmount,
    tokenDepositAmount,
    tokenWithdrawAmount
  } = props;
  const similarJSXCodeInBothDepositAndWithdraw = (keyWord) => {
    //let keyWordFnName = keyWord + "Ether";
    return (
      <Tab eventKey={keyWord.toLowerCase()} title={keyWord} className="bg-dark">
        <table className="table table-dark table-sm small">
          <thead>
            <tr>
              <th>Token</th>
              <th>Wallet</th>
              <th>Exchange</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ETH</td>
              <td>{etherBalance}</td>
              <td>{exchangeEtherBalance}</td>
            </tr>
          </tbody>
        </table>
        <form
          className="row"
          onSubmit={(event) => {
            event.preventDefault();
            if(keyWord === "Deposit") {
            depositEther(
              dispatch,
              exchange,
              web3,
              etherDepositAmount,
              account
            );
            } else {
            withdrawEther(dispatch,exchange,web3,etherWithdrawAmount, account)
            }
            console.log("form submitting...");
          }}
        >
          <div className="col-12 col-sm pr-sm-2">
            <input
              type="number"
              placeholder="ETH Amount"
              onChange={(e) => {
                if(keyWord === "Deposit") {
                    dispatch(etherDepositAmountChanged(e.target.value))
                } else {
                    dispatch(etherWithdrawAmountChanged(e.target.value))
                }
              }  
            }
              className="form-control form-control-sm bg-dark text-white"
              required
            />
          </div>
          <div className="col-12 col-sm-auto pl-sm-0">
            <button type="submit" className="btn btn-primary btn-block btn-sm">
              {keyWord}
            </button>
          </div>
        </form>
        <table className="table table-dark table-sm small">
          <tbody>
            <tr>
              <td>MTN</td>
              <td>{tokenBalance}</td>
              <td>{exchangeTokenBalance}</td>
            </tr>
          </tbody>
        </table>
        <form
          className="row"
          onSubmit={(event) => {
            event.preventDefault();
            if(keyWord === "Deposit") {
                depositToken(
                  dispatch,
                  exchange,
                  web3,
                  token,
                  tokenDepositAmount,
                  account
                );
                } else {
                withdrawToken(dispatch,exchange,web3,token,tokenWithdrawAmount, account)
                }
            console.log("form submitting...");
          }}
        >
          <div className="col-12 col-sm pr-sm-2">
            <input
              type="number"
              placeholder="MTN Amount"
              onChange={(e) => {
                if(keyWord === "Deposit") {
                    dispatch(tokenDepositAmountChanged(e.target.value))
                } else {
                    dispatch(tokenWithdrawAmountChanged(e.target.value))
                }
              }
            }  
              className="form-control form-control-sm bg-dark text-white"
              required
            />
          </div>
          <div className="col-12 col-sm-auto pl-sm-0">
            <button type="submit" className="btn btn-primary btn-block btn-sm">
              {keyWord}
            </button>
          </div>
        </form>
      </Tab>
    );
  };

  return (
    <Tabs defaultActiveKey="deposit" className="bg-dark text-white">
      {similarJSXCodeInBothDepositAndWithdraw("Deposit")}
      {similarJSXCodeInBothDepositAndWithdraw("Withdraw")}
    </Tabs>
  );
};

class Balance extends Component {
  // These are from the Content.js, better explanation that side
  componentWillMount() {
    this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const { dispatch, web3, exchange, token, account } = this.props;
    // this comes from the balance methods in Exchange.sol and maybe Token.sol
    await loadBalances(dispatch, web3, exchange, token, account);
  }

  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">Balance</div>
        <div className="card-body">
          {this.props.showForm ? showForm(this.props) : <Spinner />}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const balancesLoading = balancesLoadingSelector(state);
  console.log({
    account: accountSelector(state),
    exchange: exchangeSelector(state),
    token: tokenSelector(state),
    web3: web3Selector(state),
    etherBalance: etherBalanceSelector(state),
    tokenBalance: tokenBalanceSelector(state),
    exchangeEtherBalance: exchangeEtherBalanceSelector(state),
    exchangeTokenBalance: exchangeTokenBalanceSelector(state),
    balancesLoading,
  });
  return {
    account: accountSelector(state),
    exchange: exchangeSelector(state),
    token: tokenSelector(state),
    web3: web3Selector(state),
    etherBalance: etherBalanceSelector(state),
    tokenBalance: tokenBalanceSelector(state),
    exchangeEtherBalance: exchangeEtherBalanceSelector(state),
    exchangeTokenBalance: exchangeTokenBalanceSelector(state),
    balancesLoading,
    showForm: !balancesLoading,
    etherDepositAmount: etherDepositAmountSelector(state),
    etherWithdrawAmount: etherWithdrawAmountSelector(state),
    tokenDepositAmount: tokenDepositAmountSelector(state),
    tokenWithdrawAmount: tokenWithdrawAmountSelector(state),
  };
}

export default connect(mapStateToProps)(Balance);
