import { get } from "lodash";
import { createSelector } from "reselect";

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
export const exchangeLoadedSelector = createSelector(exchangeLoaded, exchange => exchange);

export const contractsLoadedSelector = createSelector(
    tokenLoaded,
    exchangeLoaded,
    (tl,el) => (tl && el)
);
