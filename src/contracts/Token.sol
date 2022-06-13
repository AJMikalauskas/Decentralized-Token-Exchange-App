// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

contract Token {
    string public name = "My Token Name";
    string public symbol = "MTN";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    // Use constructor to define totalSupply, can't and shouldn't be defined above
        // constructors have to have public keyword, supply always needs to be in this format
            // 10 to the power of 18 times the number of tokens you want, which in this instance is 1,000,000
    constructor()public {
        totalSupply = 1000000 * (10**decimals);
    }
}