import {combineReducers} from 'redux';

function web3(state={},action) {
    switch(action.type) {
        case 'WEB3_LOADED':
            return { ...state, connection: action.connection }
        case 'WEB3_ACCOUNT_LOADED':
            return { ...state, account: action.account}
        default:
            return state 
    }
}

// Each smart contract will have their own individual reducer
    // add loaded property which is a boolean, to only show content of page if both these smart contracts
    // actually comeback instead of coming back false; if come back, return true.
function token(state={},action) {
    switch(action.type) {
        case 'TOKEN_LOADED':
            return { ...state, contract: action.contract, loaded: true}
        default:
            return state 
    }
}

function exchange(state={},action) {
    switch(action.type) {
        case 'EXCHANGE_LOADED':
            return { ...state, contract: action.contract, loaded: true}
        case 'CANCELLED_ORDERS_LOADED':
            return { ...state, cancelledOrders: { loaded : true, data : action.cancelledOrders}}
        case 'FILLED_ORDERS_LOADED':
                return { ...state, filledOrders: { loaded : true, data : action.filledOrders}}
        case 'ALL_ORDERS_LOADED':
                return { ...state, allOrders: { loaded : true, data : action.allOrders}}
        default:
            return state 
    }
}

// This will end up exporting all the reducer functions/methods.
const rootReducer = combineReducers({
    // ES6 feature to be able to set properties in object if have same name with just the word
    // web3 word below is really web3: web3.
    web3,
    token,
    exchange
})

export default rootReducer;