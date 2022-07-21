import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Tabs,Tab } from 'react-bootstrap';
import Spinner from './Spinner';
import { exchangeSelector,tokenSelector,accountSelector,web3Selector,buyOrderSelector, sellOrderSelector } 
from '../store/selectors';
import { buyOrderAmountChanged, buyOrderPriceChanged, sellOrderAmountChanged, sellOrderPriceChanged } 
from '../store/actions';
import { makeBuyOrder, makeSellOrder } from '../store/interactions';
// Similar to what's in the Balance.js component
const showForm = (props) => {
    const {
        dispatch,
        exchange,
        token,
        web3, 
        buyOrder,
        sellOrder,
        account
    } = props;
    const dynamicTabContent = (keyWord) => {
        let amountWithKeyword = `${keyWord} Amount`;
        let priceWithKeyword = `${keyWord} Price`;

        return (
        <Tab eventKey={keyWord.toLowerCase()} title={keyWord} className="bg-dark">
            <form onSubmit={(event) => {
                event.preventDefault()
                if(keyWord === "Buy")
                {
                    makeBuyOrder(dispatch,exchange,token,web3,buyOrder,account)
                } else {
                    makeSellOrder(dispatch,exchange,token,web3,sellOrder,account)
                }
            }}>
            <div className='form-group small'>
                <label>{amountWithKeyword} (DAPP)</label>
                <div className='input-group'>
                    <input
                    type="text"
                    className="form-control form-control-sm bg-dark text-white"
                    placeholder={amountWithKeyword}
                    onChange={(e) => {
                        if(keyWord === "Buy") {
                            dispatch( buyOrderAmountChanged(e.target.value))
                        } else {
                            dispatch( sellOrderAmountChanged(e.target.value))
                        }
                    }}
                    required
                    />
                </div>
            </div>
            <div className='form-group small'>
                <label>{priceWithKeyword}</label>
                <div className='input-group'>
                    <input
                    type="text"
                    className='form-control form-control-sm bg-dark text-white'
                    placeholder={priceWithKeyword}
                    onChange={(e) => {
                        if(keyWord === "Buy"){
                            dispatch( buyOrderPriceChanged(e.target.value))
                        } else {
                            dispatch( sellOrderPriceChanged(e.target.value))
                        }
                    }}
                    required
                    />
                </div>
            </div>
            {/* ? (buyOrder.amount && buyOrder.price) */}
            <small>{keyWord === "Buy" && (buyOrder.amount && buyOrder.price) ? `Total: ${(buyOrder.amount*buyOrder.price)} ETH` : 
            (sellOrder.amount && sellOrder.price) ? `Total: ${(sellOrder.amount*sellOrder.price)} ETH` : null}</small>
            <button type='submit' className="btn btn-primary btn-sm btn-block">{keyWord} Order</button>
            </form>
        </Tab>
        )
    }
    return(
        <Tabs defaultActiveKey="buy" className="bg-dark text-white">
            {dynamicTabContent("Buy")}
            {dynamicTabContent("Sell")}
            {/* <Tab eventKey='buy' title="Buy" className="bg-dark">

            </Tab>
            
            <Tab eventKey='sell' title="Sell" className="bg-dark">

            </Tab> */}
        </Tabs>
    )
}

class NewOrder extends Component {
    render() {
        return (
            <div className='card bg-dark text-white'>
                <div className='card-header'>
                    New Order
                </div>
                <div className="card-body">
                    { this.props.showForm ? showForm(this.props) : <Spinner/>}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    // These are both return object and we will use the orderMaking property to determing the showForm prop 
        // boolean value; if both the showOrder.orderMaking and buyOrder.orderMaking is false, 
            // can showForm or set showForm to true else it's false if either of the above orderMaking values 
                // is true.
    const buyOrder = buyOrderSelector(state);
    const sellOrder = sellOrderSelector(state);
    return {
        exchange: exchangeSelector(state),
        token: tokenSelector(state),
        account: accountSelector(state),
        web3: web3Selector(state),
        buyOrder,
        sellOrder,
        showForm: !buyOrder.orderMaking && !sellOrder.orderMaking,
    }
}

export default connect(mapStateToProps)(NewOrder);