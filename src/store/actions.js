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