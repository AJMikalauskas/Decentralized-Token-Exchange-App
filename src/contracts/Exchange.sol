// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

// Deposit and Withdrawal funds
// Manage Orders - Make Or Cancel
// Handle Trades - Charge Gas Fees/Fees
    // TODO:
    //? [1] Set the fee/fee account
    //? [] Deposit Ether
    //? [] Withdraw Ether
    //? [2] Deposit tokens
    //? [] Withdraw tokens
    //? [] Check Balances 
    //? [] Make order
    //? [] Cancel order
    //? [] Fill order
    //? [] Charge Fees


import "./Token.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Exchange {
    // So add() is a possible method and won't result in an error
        using SafeMath for uint;
    //? [x] Set the fee/fee account
    // Variables
    address public feeAccount; // the account that receives exchange fees
    uint256 public feePercent; // the fee percentage, lower on most exchanges, but we'll use 10%
    //mapping which is internal tracking mechanism to determine which token deposited, amoutn deposited, and who they belong to
        // nested mapping like allowance in Token.sol -> 1st key address is all tokens deposited(types and more),
            // 2nd key is address of user who deposited tokens themselves, show their balances of the specific token
    mapping(address => mapping(address => uint256)) public tokens;

    // Deposit event emitted, defining params here
    event Deposit(address token, address user, uint256 amount, uint256 balance);


    // create feeAccount in () of constructor -> see Exchange.test.js
    constructor(address _feeAccount, uint256 _feePercent) public {
        // Similar to C# constructors
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // Can deposit token import from above and any token as long as it follows
        // ERC-20 format
    function depositToken(address _token, uint _amount) public
    {
        // Which Token? -> do so by adding address _token in params, deposits token on ethereum
        // How much? -> do so by defining _amount in params
        // Send tokens to this contract
            // Token allows you to access the functions and other things from described token
            // transferFrom() should be in all tokens so can be called here
            // _ from is the msg.sender, _to is the this which is the smart contract currently or Exchange;
                // it is cast to address, and _ value is the _amount param seen in params of this method
            // transferFrom() allows exchange to move tokens to itself, must approve tokens
                // before calling this method -> write test for this below statement
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
            // this transferFrom() if successful will return true 
                // so using the require() is a really good way for it to check if this succeeds
                    // will only continue in method if true is returned
        // internal mapping mechanism of tracking tokens and user addresses and amounts used below
            // the value of the mapping by default is 0, user1 transfers tokens to the exchange and by doing so 
                // gets the internal mapping mechanism to be equal to 10 tokens, test to see?
        // Manage deposit - update balance [X]
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);


        //Emit event to listeners/buyers? -> emit Deposit event, create and define params and their values 
            // above constructor
        // token param is the _token address, the user param is the msg.sender or user1 address from test
            // the amount is just the _ amount used as param in here, and the balance of the specified token 
                // for the specified user is the nested mapping of tokens
                // token, user, amount, balance
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

}