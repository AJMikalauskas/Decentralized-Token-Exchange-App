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