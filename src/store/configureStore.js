import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";

//Middleware logger to use for redux devtools and console log 
const loggerMiddleware = createLogger();
// For any future middleware we add.
const middleware = [];

// For Redux Devtools specifically -> allows us to connect to app via redux devtools???
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// older version of react redux, since most of react redux is done using @reduxjs/toolkit for future versions of react redux
export default function configureStore(preloadedState) {
    // Adds all reducers including preloadedState param and composeEnhancers middleware redux devtools with redux
        // Remember spread operator(...) from ES6.
    return createStore(rootReducer,preloadedState, composeEnhancers(applyMiddleware(...middleware, loggerMiddleware)))
}