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