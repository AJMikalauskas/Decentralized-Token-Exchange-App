import React, {Component} from 'react'
import { connect } from 'react-redux'
import { orderBookSelector, orderBookLoadedSelector } from '../store/selectors'
import Spinner from './Spinner'

//Format orders to be table specific and individual table item specific
const renderOrder = (order) => {
    return(
        <tr key={order.id}>
            <td>{order.tokenAmount}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
            <td>{order.etherAmount}</td>
        </tr>
    )
}

const showOrderBook = (props) => {
    //! HELPFUL ES6 FEATURE
    const {orderBook} = props
    return (
        <tbody>
                {/* <tr>
                    <th>MTN</th>
                    <th>MTN/ETH</th>
                    <th>ETH</th>
                </tr> */}
            {/* List Sell Orders*/}
            {orderBook.sellOrders.map((order) =>{ return renderOrder(order,props)})}
            {/* Create Divider */}
            <br/>
            <br/>
                <tr>
                    <th>MTN</th>
                    <th>MTN/ETH</th>
                    <th>ETH</th>
                </tr>
            {/* List Buy Orders  */}
            {orderBook.buyOrders.map((order) =>{ return renderOrder(order,props)})}
        </tbody>
    )
}
class OrderBook extends Component {
    render() {
        console.log(this.props.orderBook,this.props.showOrderBook)
        return (
            <div className='vertical'>
                <div className='card bg-dark text-white'>
                    <div className='card-header'>
                        Order Book 
                    </div>
                    <div className='card-body order-book'>
                        <table className = "table table-dark table-sm small">
                            {this.props.showOrderBook ? showOrderBook(this.props) : <Spinner type="table"/>}
                        </table>
                    </div>
                </div>
            </div>    
        )
    }
}

function mapStateToProps(state) {
    return {
        orderBook: orderBookSelector(state),
        showOrderBook: orderBookLoadedSelector(state)
    }
}

export default connect(mapStateToProps)(OrderBook);