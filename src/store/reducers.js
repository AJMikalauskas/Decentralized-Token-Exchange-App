import {combineReducers} from 'redux';

function web3(state={},action) {
    switch(action.type) {
        case 'WEB3_LOADED':
            return { ...state, connection: action.connection }
        case 'WEB3_ACCOUNT_LOADED':
            return { ...state, account: action.account}
        case 'ETHER_BALANCE_LOADED':
            return { ...state, balance: action.balance}
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
        case 'TOKEN_BALANCE_LOADED':
            return { ...state, balance: action.balance}
        default:
            return state 
    }
}

function exchange(state={},action) {
    let index
    let data
    switch(action.type) {
        case 'EXCHANGE_LOADED':
            return { ...state, contract: action.contract, loaded: true}
        case 'CANCELLED_ORDERS_LOADED':
            return { ...state, cancelledOrders: { loaded : true, data : action.cancelledOrders}}
        case 'FILLED_ORDERS_LOADED':
                return { ...state, filledOrders: { loaded : true, data : action.filledOrders}}
        case 'ALL_ORDERS_LOADED':
                return { ...state, allOrders: { loaded : true, data : action.allOrders}}
        case 'ORDER_CANCELLING':
            return {...state, orderCancelling: true}
        case 'ORDER_CANCELLED':
            return {
                ...state, 
                orderCancelling: false,
                cancelledOrders: {
                    ...state.cancelledOrders, 
                    data: [
                        // retrieve state of cancelledOrders data while also adding the newly cancelled Order 
                        // via the param from actions.js
                        ...state.cancelledOrders.data,
                        action.order
                    ]
                }
            }
        case 'ORDER_FILLING':
            return { ...state, orderFilling: true }
        case 'ORDER_FILLED':
            //Prevent duplicate orders
            index = state.filledOrders.data.findIndex(order => order.id === action.order.id)

            if(index === -1)
            {
                data = [...state.filledOrders.data, action.order]
            } else {
                data = state.filledOrders.data
            }

            return {
                ...state,
                orderFilling: false,
                filledOrders: {
                    ...state.filledOrders,
                    data
                }
            }

        case 'EXCHANGE_ETHER_BALANCE_LOADED':
            return { ...state, etherBalance: action.balance}
        case 'EXCHANGE_TOKEN_BALANCE_LOADED':
            return { ...state, tokenBalance: action.balance}
        case 'BALANCES_LOADING':
            return { ...state, balancesLoading: true}
        case 'BALANCES_LOADED':
            return { ...state, balancesLoading: false}

        // keep track and store amount of ether being deposited
        case 'ETHER_DEPOSIT_AMOUNT_CHANGED':
            return { ...state, etherDepositAmount: action.amount}
        // keep track and store amount of ether withdrawed
        case 'ETHER_WITHDRAW_AMOUNT_CHANGED':
            return { ...state, etherWithdrawAmount: action.amount}

        // keep track and store amount of token being deposited
        case 'TOKEN_DEPOSIT_AMOUNT_CHANGED':
            return { ...state, tokenDepositAmount: action.amount}
        // keep track and store amount of token withdrawed
        case 'TOKEN_WITHDRAW_AMOUNT_CHANGED':
            return { ...state, tokenWithdrawAmount: action.amount}   
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