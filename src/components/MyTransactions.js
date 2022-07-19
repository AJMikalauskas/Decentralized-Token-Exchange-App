import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Tab,Tabs } from 'react-bootstrap'
import {
    myFilledOrdersLoadedSelector,
    myFilledOrdersSelector,
    myOpenOrdersLoadedSelector,
    myOpenOrdersSelector,
    exchangeSelector,
    accountSelector,
    orderCancellingSelector
} from  "../store/selectors";
import Spinner from './Spinner';
import { cancelOrder } from '../store/interactions';

const showMyFilledOrders = (props) => {
    const { myFilledOrders } = props;
    return(
        <tbody>
        { myFilledOrders.map((order) => {
            return (
                <tr key={order.id}>
                    <td className='text-muted'>{order.formattedTimestamp}</td>
                    <td className={`text-${order.orderTypeClass}`}>{order.orderSign}{order.tokenAmount}</td>
                    <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
                </tr>
            )
        })}
        </tbody>
    )
}
const showMyOpenOrders = (props) => {
    const {myOpenOrders, dispatch, exchange, account} = props;
    return(
        <tbody>
            { myOpenOrders.map((order) => {
                return ( 
                    <tr key={order.id}>
                        <td className={`text-${order.orderTypeClass}`}>{order.tokenAmount}</td>
                        <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
                        {/* Cancel order className is to add a pointer when hovering over the X */}
                        <td className='text-muted cancel-order'
                            onClick={(e) => { //console.log("cancelling orders")
                                // Have access to account and exchange by their selectors in the store selectors file and make into props
                                    // access to dipatch via props and order via the map arrow function.
                                cancelOrder(dispatch, exchange, order, account)
                                //subscribeToEvents(dispatch,exchange)
                            }}
                        >x</td>
                    </tr>
                )
            })}
        </tbody>
    )
}

class MyTransactions extends Component {
    render() {
        return(
            <div className='card bg-dark text-white'>
                <div className='card-header'>
                    My Transactions
                </div>
                <div className='card-body'>
                    <Tabs defaultActiveKey="trades" className="bg-dark text-white">
                        <Tab eventKey='trades' title="Trades" className="bg-dark">
                            <table className='table table-dark table-sm small'>
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>MTN</th>
                                        <th>MTN/ETH</th>
                                    </tr>
                                </thead>
                                { this.props.showMyFilledOrders ? showMyFilledOrders(this.props) : <Spinner type="table"/>}
                            </table>
                        </Tab>
                        <Tab eventKey="orders" title="Orders">
                            <table className="table table-dark table-sm small">
                                <thead>
                                    <tr>
                                        <th>Amount</th>
                                        <th>MTN/ETH</th>
                                        <th>Cancel</th>
                                    </tr>
                                </thead>
                                { this.props.showMyOpenOrders ? showMyOpenOrders(this.props) : <Spinner type="table"/>}
                            </table>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    // Have to connect/import correct ganache account to get the correct results of the 3 filled orders and 10 open orders.
        // Loaded selectors are true. 
    console.log({
        myFilledOrders: myFilledOrdersSelector(state),
        showMyFilledOrders: myFilledOrdersLoadedSelector(state),
        myOpenOrders: myOpenOrdersSelector(state),
        showMyOpenOrders: myOpenOrdersLoadedSelector(state)
    })
    // showingMyOpenOrders based on not only the loadedSelector but also based on if a order is currently cancelling
    const myOpenOrdersLoaded = myOpenOrdersLoadedSelector(state);
    const orderCancelling = orderCancellingSelector(state);
    return {
        myFilledOrders: myFilledOrdersSelector(state),
        showMyFilledOrders: myFilledOrdersLoadedSelector(state),
        myOpenOrders: myOpenOrdersSelector(state),
        showMyOpenOrders: myOpenOrdersLoaded && !orderCancelling,
        exchange: exchangeSelector(state),
        account: accountSelector(state),
    }
}

export default connect(mapStateToProps)(MyTransactions);