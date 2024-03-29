import {connect} from 'react-redux'
import Chart from 'react-apexcharts'
import Spinner from './Spinner'
import React, { Component } from 'react'
import { chartOptions,dummyData } from './PriceChart.config'
import { priceChartLoadedSelector, priceChartSelector } from '../store/selectors'


// Converted of '+' and '-' symbol from the priceChart.lastPriceChange to green up triangle nbsp or red down triangle nbsp.
const priceSymbol = (lastPriceChange) => {
    let output
    if(lastPriceChange === '+') {
        output = <span className="text-success">&#9650;</span> // Green up triangle
    } else {
        output = <span className="text-danger">&#9660;</span> // Red down triangle test
    }
    return (output)
}
const showPriceChart = (priceChart) => {
    return (
        <div className="price-chart">
            <div className='price'>
                {/* HTML entity explanation https://www.w3schools.com/html/html_entities.asp  */}
                <h4>DAPP/ETH &nbsp; {priceSymbol(priceChart.lastPriceChange)} &nbsp;{priceChart.lastPrice}</h4>
            </div>
            <Chart options={chartOptions} series={priceChart.series} type="candlestick" width="100%" height="100%" />
        </div>
    )
}

class PriceChart extends Component {
    render() {
        return (
            <div className='card bg-dark text-white'>
                <div className="card-header">
                    Price Chart
                </div>
                <div className='card-body'>
                    {/* Ternary operation, if the priceChart is laoded it will call and show it with the this.props.priceChart; else show Spinner */}
                    {this.props.priceChartLoaded ?  showPriceChart(this.props.priceChart) : <Spinner/>}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    // console.log({
    //     priceChartLoaded: priceChartLoadedSelector(state),
    //     priceChart: priceChartSelector(state),
    // })
    return {
        priceChartLoaded: priceChartLoadedSelector(state),
        priceChart: priceChartSelector(state),
    }
}

export default connect(mapStateToProps)(PriceChart);