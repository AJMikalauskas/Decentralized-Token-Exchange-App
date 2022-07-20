import React, {Component} from "react";
import { connect } from "react-redux";
import { loadAllOrders, subscribeToEvents } from "../store/interactions";
import { exchangeSelector } from "../store/selectors";
import Trades from "./Trades";
import OrderBook from "./OrderBook";
import MyTransactions from "./MyTransactions";
import PriceChart from "./PriceChart";
import Balance from "./Balance";

class Content extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props)
  }
  // Reorganizes to only destructure from props rather than calling as just a param
  async loadBlockchainData(props) {
    const { exchange, dispatch } = props;
    // access exchange by new selector in selectors.js
    await loadAllOrders(exchange,dispatch);
    //subscribeToEvents is here,Uses In Content.js so that the component(the whole page) re-renders 
      // with new data and when you click and confirm to cancel an order, 
        // it will update the page and should remove the order from order book and orders tab too in MyTransactions. 
    await subscribeToEvents(dispatch,exchange)
  }
    render() {
        return (
            <div className="content">
            <div className="vertical-split">
              <Balance/>
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
              <OrderBook/>
           <div className="vertical-split">
              <PriceChart/>
              <MyTransactions/>
            </div>
            <Trades />
          </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        exchange: exchangeSelector(state)
    }
}

export default connect(mapStateToProps)(Content);