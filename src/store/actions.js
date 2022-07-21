export function web3Loaded(connection) {
    return {
        type: 'WEB3_LOADED',
        // ES6 function of return to add connection property and set equal to connection param
        connection
    }
}
// load account(s) action
export function web3AccountLoaded(account) {
    return {
        type: "WEB3_ACCOUNT_LOADED",
        account
    }
}

// load token smart contract action
export function tokenLoaded(contract) {
    return {
        type: "TOKEN_LOADED",
        contract
    }
}

// load exchange smart contract action
export function exchangeLoaded(contract) {
    return {
        type: "EXCHANGE_LOADED",
        contract
    }
}

// load cancelled orders
export function cancelledOrdersLoaded(cancelledOrders) {
    return {
        type: "CANCELLED_ORDERS_LOADED",
        cancelledOrders
    }
}

// load filled orders
export function filledOrdersLoaded(filledOrders) {
    return {
        type: "FILLED_ORDERS_LOADED",
        filledOrders
    }
}

// load all orders
export function allOrdersLoaded(allOrders) {
    return {
        type: "ALL_ORDERS_LOADED",
        allOrders
    }
}

// in process of cancellingOrder action
export function orderCancelling() {
    return {
        type: "ORDER_CANCELLING",
    }
}

// Cancelled Order action
export function orderCancelled(order) {
    return {
        type: "ORDER_CANCELLED",
        order
    }
}

// in process of fillingOrder action
export function orderFilling() {
    return {
        type: "ORDER_FILLING",
    }
}

// Filled Order/Trade action
export function orderFilled(order) {
    return {
        type: "ORDER_FILLED",
        order
    }
}


// Check if ether balance is loaded for current address/user
export function etherBalanceLoaded(balance) {
    return {
        type: "ETHER_BALANCE_LOADED",
        balance
    }
}

// Check if token balance is loaded for current address/user
export function tokenBalanceLoaded(balance) {
    return {
        type: "TOKEN_BALANCE_LOADED",
        balance
    }
}

// Check if ether balance on exchange is loaded for current address/user
export function exchangeEtherBalanceLoaded(balance) {
    return {
        type: "EXCHANGE_ETHER_BALANCE_LOADED",
        balance
    }
}

// Check if token balance on exchange is loaded for current address/user
export function exchangeTokenBalanceLoaded(balance) {
    return {
        type: "EXCHANGE_TOKEN_BALANCE_LOADED",
        balance
    }
}

// Check if all balances above are loaded
export function balancesLoaded() {
    return {
        type: "BALANCES_LOADED",
    }
}

// Check loading State of other 4 while they're loading show balancesLoading
export function balancesLoading() {
    return {
        type: 'BALANCES_LOADING'
    }
} 

// Storing and tracking value of the ether amount input of deposit
export function etherDepositAmountChanged(amount) {
    return {
        type: 'ETHER_DEPOSIT_AMOUNT_CHANGED',
        amount
    }
} 

// Storing and tracking value of the ether amount input of withdraw
export function etherWithdrawAmountChanged(amount) {
    return {
        type: 'ETHER_WITHDRAW_AMOUNT_CHANGED',
        amount
    }
} 

// Storing and tracking value of the token amount input of deposit
export function tokenDepositAmountChanged(amount) {
    return {
        type: 'TOKEN_DEPOSIT_AMOUNT_CHANGED',
        amount
    }
} 

// Storing and tracking value of the token amount input of withdraw
export function tokenWithdrawAmountChanged(amount) {
    return {
        type: 'TOKEN_WITHDRAW_AMOUNT_CHANGED',
        amount
    }
} 

// Buy Order

// tracks value of input amount by amount param
export function buyOrderAmountChanged(amount) {
    return {
        type: "BUY_ORDER_AMOUNT_CHANGED",
        amount
    }
}
// tracks value of input amount converted to price by price param
export function buyOrderPriceChanged(price) {
    return {
        type: "BUY_ORDER_PRICE_CHANGED",
        price
    }
}
// tracks whether in the state of buyOrderMaking and will eventually add a buyOrderMade action to finish this?
export function buyOrderMaking(price) {
    return {
        type: "BUY_ORDER_MAKING"
    }
}

// finish the buyOrderMaking/sellOrderMaking by this OrderMade action which will also pass in order 
    // and change the buyOrderMaking/sellOrderMaking state
export function orderMade(order) {
    return {
        type: "ORDER_MADE",
        order
    }
}

// Sell Order
    // Almost the exact same as the Buy Order actions, only change is from "buy" keyword to "sell" keyword
// tracks value of input amount by amount param
export function sellOrderAmountChanged(amount) {
    return {
        type: "SELL_ORDER_AMOUNT_CHANGED",
        amount
    }
}
// tracks value of input amount converted to price by price param
export function sellOrderPriceChanged(price) {
    return {
        type: "SELL_ORDER_PRICE_CHANGED",
        price
    }
}
// tracks whether in the state of sellOrderMaking and will eventually end by orderMade() action.
export function sellOrderMaking(price) {
    return {
        type: "SELL_ORDER_MAKING"
    }
}
