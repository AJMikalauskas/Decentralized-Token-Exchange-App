import { get, reject, groupBy, maxBy, minBy } from "lodash";
import moment from "moment";
import { createSelector } from "reselect";
import { GREEN, RED, ETHER_ADDRESS, tokens, ether } from "../helpers";
// Can see where to get account from redux dev tools state -> web3 -> account
    // get allows us to provide a default value in case such things as web3.account doesn't exist so page won't blow up. 
    // The 1st param is the state object, 2nd param is the path such as state.web3.account but as a string, 3rd param is default value. 
const account = state => get(state, "web3.account", "failed to access account");
// creates accountSelectors using the above account as the 1st param and then the 2nd param as an arrow function which returns param of account
export const accountSelector = createSelector(account, acct => acct);

// Need 2 selectors, 1 for each smart contract we're loading via these selectors -> can see how to get via redux dev tools
    // Default values are false, as not loaded, only loaded if get returns correctly
    // All of these are booleans including tokenLoaded and exchangeLoaded. In which then the ultimate boolean of contractLoaded
        // is based on tokenLoaded and exchangeLoaded boolean.
const tokenLoaded = state => get(state, "token.loaded", false)
// export in same way as accountSelector
export const tokenLoadedSelector = createSelector(tokenLoaded, tkn => tkn);

const exchangeLoaded = state => get(state, "exchange.loaded", false)
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el);

// access exchange to loadAllOrders
const exchange = state => get(state, 'exchange.contract')
export const exchangeSelector = createSelector(exchange, e => e);

export const contractsLoadedSelector = createSelector(
    tokenLoaded,
    exchangeLoaded,
    (tl,el) => (tl && el)
);

// All Orders without selector
const allOrdersLoaded = state => get(state,'exchange.allOrders.loaded', false)
const allOrders = state => get(state, 'exchange.allOrders.data', [])

// Cancelled Orders Loaded and Cancelled Orders Selectors
const cancelledOrdersLoaded = state => get(state,'exchange.cancelledOrders.loaded', false)
export const cancelledOrdersLoadedSelector = createSelector(cancelledOrdersLoaded, loaded => loaded)

const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', []);
export const cancelledOrdersSelector = createSelector(cancelledOrders, o => o);

// filledOrdersLoaded simialr to the loaded of token and exchange.
const filledOrdersLoaded = state => get(state, 'exchange.filledOrders.loaded', false)
export const filledOrdersLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded)

// access filledOrders and display to table in Trades.js
const filledOrders = state=> get(state, 'exchange.filledOrders.data', []);
export const filledOrdersSelector = createSelector(
    filledOrders, 
    (orders) => {
        // Sort orders by date ascending for price comparison
        orders = orders.sort((a,b) => {return a.timestamp - b.timestamp});
        // Decorate the orders
        orders = decorateFilledOrders(orders);
        // we will format the fillOrders here to the table format we want
            // sort by date descending as 1st sorting param -> https://tutorial.eyehunts.com/js/sort-array-in-descending-order-javascript-3-ways-code/ 
        orders = orders.sort((a,b) => {return b.timestamp - a.timestamp});
        console.log(orders)
        // Necessary to return orders so that information will show in the JSX conditionl on Trades.js component
        return orders;
    }
);

// Makes call to design specific order from orders.
const decorateFilledOrders = (orders) => {
    // Track previous order to compare history
    let previousOrder = orders[0];
    return(
        orders.map((order) => {
             order = decorateOrder(order);
             order = decorateFilledOrder(order,previousOrder);
             previousOrder = order //update the previous order once it's decorated.
             return order;
        })
    )
}

// Decorate different types of orders to have human readable timestamp,price, making trades green/red and more
const decorateOrder = (order) => {
    let tokenAmount;
    let etherAmount;
    //if tokenGive to show which token is given based on knowing ether address.
    if(order.tokenGive === ETHER_ADDRESS)
    {
        etherAmount = order.amountGive;
        tokenAmount = order.amountGet;
    }
    else {
        etherAmount = order.amountGet;
        tokenAmount = order.amountGive;
    }

    // calculate token price of the order to 5 decimal places
    const precision = 100000;
    let tokenPrice = (etherAmount / tokenAmount);
    tokenPrice = Math.round(tokenPrice * precision) / precision;

    // return order with spread operator and tokenAmount and etherAmount 
    return ({
        ...order,
        tokenAmount: tokens(tokenAmount),
        etherAmount: ether(etherAmount),
        tokenPrice: tokenPrice,
        formattedTimestamp: moment.unix(order.timestamp).format('h:mm:ss a M/D')
    });
}

//Decorate filled orders specifically
const decorateFilledOrder = (order,previousOrder) => {
    return({
        ...order,
        tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id,previousOrder)
    })
}

    // will show red price if tokenPrice is less than the previous tokenPrice, will show green price if greater.
const tokenPriceClass = (tokenPrice, orderId, previousOrder) => {
    // Show green price if only 1 order exists
    if(previousOrder.id === orderId)
    {
        return GREEN;
    }
    //previousOrder is just the actual previous order with all the properties
        // thie returns green if the tokenPrice in the previous is 
    if(previousOrder.tokenPrice <= tokenPrice)
    {
        return GREEN; // denoted by success class in bootstrap
    }
    else {
        return RED; // denoted by danger in bootstrap
    }
}

// filter orders here
const openOrders = state => {
    const all = allOrders(state)
    const cancelled = cancelledOrders(state)
    const filled = filledOrders(state)

    const openOrders = reject(all, (order) => {
        // iterates over all the orders and checks current order.id against the order ids in the filledOrders and cancelledOrders
            // if exists return and filter out, else keep in the openOrders
        // if the order is filled, will be part of the orderFilled const and is the filtered data as part of the 2nd param
        const orderFilled = filled.some((o) => o.id === order.id)
        // Similar logic to orderFilled
        const orderCancelled = cancelled.some((o) => o.id === order.id)
        return (orderFilled || orderCancelled)
    })
    return openOrders;
}

// These are the allOrders selectors butwe renamed to orderBook from above.
    // Know that orderBookLoaded is only loaded if filled, cancelled and all orders are loaded.
    // Will use all 3 later when getting orders for order book by filtering allOrders and taking out cancelled and filledOrders.
const orderBookLoaded = state => cancelledOrdersLoaded(state) && filledOrdersLoaded(state) && allOrdersLoaded(state);
export const orderBookLoadedSelector = createSelector(orderBookLoaded, loaded => loaded)

// Create the order book
export const orderBookSelector = createSelector(
    // Going to assume that the filtered orders if what the openOrders pass in is
    openOrders,
    (orders) => {
        // Decorate Orders
        orders = decorateOrderBookOrders(orders); 
        // Group orders by orderType
        orders = groupBy(orders, 'orderType');


        // HIGHER PRICE FIRST, LOWER PRICE LAST
        // Fetch buy orders
            // Get buyOrders by get() method from lodash, empty array is default value.
        const buyOrders = get(orders,'buy',[])
        // Sort buy orders by token price ascending
        orders = {
            ...orders,
            buyOrders: buyOrders.sort((a,b) => b.tokenPrice - a.tokenPrice)
        }

        // Fetch sell orders
            // Get sellOrders by get() method from lodash, empty array is default value.
        const sellOrders = get(orders,'sell',[])
        // Sort sell orders by token price ascending
        orders = {
            ...orders,
            sellOrders: sellOrders.sort((a,b) => b.tokenPrice - a.tokenPrice)
        }
        
        return orders;
    }
)

// Similar logic to decorateFilledOrders()
const decorateOrderBookOrders = (orders) => {
    return(
        orders.map((order) => {
            order = decorateOrder(order)
            // Decorate order book order...
            order = decorateOrderBookOrder(order)
            return (order)
        })
    )
}

// Determine if an order is a buy or sell order based on ternary condition of the order.tokenGive being ether; if so, it's a buy order
    // else it's a sell order. Getting token by giving ether; Getting ether by giving token
const decorateOrderBookOrder = (order) => {
    const orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
    return ({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED),
        orderFillAction: (orderType === 'buy' ? 'sell' : 'buy'), 
    })
}


// For the myTransactions, but this is similar to what is shown above.
export const myFilledOrdersLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded);

export const myFilledOrdersSelector = createSelector(
    account,
    filledOrders,
    (account,orders) => {
        // Find Our Orders
        orders = orders.filter((o) => o.user === account || o.userFill === account)
        // sort by date ascending
        orders = orders.sort((a,b) => a.timestamp - b.timestamp)
        // Decorate orders - add display attributes
        orders = decorateMyFilledOrders(orders,account);
        return orders
    }
)

// Makes call to design specific order from orders.
    // Similar to decorateFilledOrders()
const decorateMyFilledOrders = (filledOrders,account) => {
    return(
        filledOrders.map((order) => {
             order = decorateOrder(order);
             order = decorateMyFilledOrder(order);
             return (order);
        })
    )
}

const decorateMyFilledOrder = (filledOrder,account) => {
    const myOrder = filledOrder.user === account
    
    let orderType
    if(myOrder) {
        orderType = filledOrder.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell';
    } else {
        orderType = filledOrder.tokenGive === ETHER_ADDRESS ? 'sell' : 'buy';
    }

    return({
        ...filledOrder,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED),
        orderSign: (orderType === 'buy' ? "+" : "-")
    })
}

export const myOpenOrdersLoadedSelector = createSelector(orderBookLoaded, loaded => loaded);

export const myOpenOrdersSelector = createSelector(
    account,
    openOrders,
    (account,openOrders) => {
        // Find Our Orders created by user account
        openOrders = openOrders.filter((o) => o.user === account);
        // Decorate orders - add display attributes
        openOrders = decorateMyOpenOrders(openOrders,account);
        // sort by date descending
        openOrders = openOrders.sort((a,b) => b.timestamp - a.timestamp)
        return openOrders;
    }
)

// Makes call to design specific order from orders.
// Similar to decorateMyFilledOrders
const decorateMyOpenOrders = (openOrders,account) => {
    return(
        openOrders.map((order) => {
             order = decorateOrder(order);
             order = decorateMyOpenOrder(order,account);
             return (order);
        })
    )
}

const decorateMyOpenOrder = (openOrder,account) => {
    let orderType = openOrder.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell';

    return({
        ...openOrder,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED)
    })
}

// Based on filledOrdersLoaded state and will return that state. Booleans based selector and similar to other selectors.
export const priceChartLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded);

export const priceChartSelector = createSelector(
    filledOrders,
    (orders) => {
        // Sort orders by date ascending to compare history
        orders = orders.sort((a,b) => a.timestamp - b.timestamp)

        //Decorate orders - add display attributes
        orders = orders.map((o) => decorateOrder(o))

        // format data in the way we want via high, low, close and open prices.
        // Get last 2 orders for final price & price change
            // Parallel Assignment by declaring and then assigning in weird/different array way 
            // slices 2 elements from end to the end of the array.
        let secondLastOrder, lastOrder
        [secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)

        // get last order price
            // gets lastOrder.tokenPrice, else if not possible, reverts to default value of 0 if lastOrder.tokenPrice not found.
        const lastPrice = get(lastOrder, 'tokenPrice', 0);

        // get second to last order price
        // gets secondLastOrder.tokenPrice, else if not possible, reverts to default value of 0 if secondLastOrder.tokenPrice not found.
        const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0);

        return ({
            // ES6 feature of the property being the same name as its value.
            lastPrice,
            // ternary operation to see what symbol to use from lastPriceChange
            lastPriceChange: (lastPrice >= secondLastPrice ? '+' : '-'),
            series: [{
                // can use empty array to see test results
                data: buildGraphData(orders)
            }]
        })
    }
)

const buildGraphData = (orders) => {
    // Use lodash groupBy() method; 2nd param is the moment.uinx(timestamp) param and startOf() with the hour param.
        // Group the orders by the hour for the graph.
    orders = groupBy(orders,(o) =>moment.unix(o.timestamp).startOf('hour').format())

    // Get each hour where data exists
    const hours = Object.keys(orders);

    // Build the graph series
    const graphData = hours.map((hour) => {
        // Select specific orders by [] -> Fetch all the orders from the current order
        const group = orders[hour]
        // Calculate price values - open, close, high, and low.

        // 1st order or open price
        const open = group[0];

        // Last order or close price
        const close = group[group.length-1] 

        // Use maxBy() lodash method and other lodash methods to get high and low price
        const high = maxBy(group, 'tokenPrice') // high price
        const low = minBy(group,'tokenPrice') // low price

        return({
            x: new Date(hour),
            y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
        })
    })
    return graphData;
}

// create orderCancellingSelector so that the loading spinner shows and 
    // multiple orders can't be cancelled at once when already cancelling another order
        // based on orderCancelling property we added in reducers.js when in process of orderCancelling action 
const orderCancelling = state => get(state, 'exchange.orderCancelling', false)
export const orderCancellingSelector = createSelector(orderCancelling, status => status)

//Create a way to fill orders by just hovering over them in the order book and being able to fulfill them there
    // make sure that you can't fulfill your own orders. -> similar to above 2 statements
const orderFilling = state => get(state, 'exchange.orderFilling', false)
export const orderFillingSelector = createSelector(orderFilling, status => status)