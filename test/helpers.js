
//Make it easier to reuse this error by using variable name instead of copying it everytime
export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';
export const EVM_REVERT = 'VM Exception while processing transaction: revert';

// This is to we can convert tokens to readable amount not with an extra 18 zeroes
  // ether follows the same fromat of wei conversion as the tokens, changed this function to be ether as the reference function
export const ether = (n) => {
    // Uses wei to ether converter previously seen because decimals(18) is 
    // Convert to BN(big number) in return
    return new web3.utils.BN(
    // equal to what is in ether to wei converter -> web3.utils.toWei()
    // not ether but has same decimal places so it works
    web3.utils.toWei(n.toString(),'ether')
    ).toString()
  
    // This is also a solution
      // n = n * (10**18)
      // return n.toString();
  }

  // Same functionality from before but instead referencing to ether function
export const tokens = (n) => ether(n)