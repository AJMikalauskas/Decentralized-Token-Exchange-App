// Bootstrap denoted names for colors
export const GREEN = "success";
export const RED = "danger";

export const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

export const DECIMALS = (10**18);

// Shortcut to avoid passing around web3 connection
export const ether = (wei) => {
    if(wei)
    {
        return(wei/DECIMALS) // 18 decimal places
    }
}

// Tokens and ether have some decimal resolution.
export const tokens = ether

// format balances to convert to wei/ether and then math.round() the balance to 2 decimal places.
    // Returns balance after.
export const formatBalance = (balance) => {
    const precision = 100; // 2 decimal places
    balance = ether(balance)
    balance = Math.round(balance * precision) / precision // Uses 2 decimal places
    return balance
}