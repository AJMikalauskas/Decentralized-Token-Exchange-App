import React, { Component } from "react";
import { connect } from "react-redux";
import {
  filledOrdersLoadedSelector,
  filledOrdersSelector,
} from "../store/selectors";
import Spinner from "./Spinner";

// need a method to contain the fillOrders mapping or else an error will occur
const showFilledOrders = (filledOrders) => {
  return (
    <tbody>
      {filledOrders.map((order) => {
        return (
          <tr className={`order-${order.id}`} key={order.id}>
            <td className="text-muted">{order.timestamp}</td>
            <td>{order.tokenAmount}</td>
            <td className={`text-${order.tokenPriceClass}`}>
              {order.tokenPrice}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

class Trades extends Component {
  render() {
    return (
      <div className="vertical">
        <div className="card bg-dark text-white">
          <div className="card-header">Trades</div>
          <div className="card-body">
            <table className="table table-dark table-sm small">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>MTN</th>
                  <th>MTN/ETH</th>
                </tr>
              </thead>
              {/* Ternary Operation with JSX Conditional */}
              {this.props.filledOrdersLoaded ? (
                showFilledOrders(this.props.fillOrders)
              ) : (
                <Spinner type="table" />
              )}
            </table>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    filledOrdersLoaded: filledOrdersLoadedSelector(state),
    fillOrders: filledOrdersSelector(state),
  };
}

export default connect(mapStateToProps)(Trades);
