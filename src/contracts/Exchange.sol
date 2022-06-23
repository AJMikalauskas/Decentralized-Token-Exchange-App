// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

// Deposit and Withdrawal funds
// Manage Orders - Make Or Cancel
// Handle Trades - Charge Gas Fees/Fees
    // TODO:
    //? [1] Set the fee/fee account
    //? [3] Deposit Ether
    //? [4] Withdraw Ether
    //? [2] Deposit tokens
    //? [5] Withdraw tokens
    //? [6] Check Balances 
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
    address constant ETHER = address(0); // ETHER address will never change, Ether has no address so we set as dummy address for tokens;
        // store Ether in tokens mapping with blank address
    //mapping which is internal tracking mechanism to determine which token deposited, amoutn deposited, and who they belong to
        // nested mapping like allowance in Token.sol -> 1st key address is all tokens deposited(types and more),
            // 2nd key is address of user who deposited tokens themselves, show their balances of the specific token
    mapping(address => mapping(address => uint256)) public tokens;

    // Deposit event emitted, defining params here
    event Deposit(address token, address user, uint256 amount, uint256 balance);
    // Withdraw event emitted, defining params here
    event Withdraw(address token, address user, uint amount, uint balance);

    // create feeAccount in () of constructor -> see Exchange.test.js
    constructor(address _feeAccount, uint256 _feePercent) public {
        // Similar to C# constructors
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // Fallback Function: reverts if Ether is sent to this smart contract by mistake
        // fallback function only called if if a function you call within a smart contract doesn't exist ->
            // see fallback test for more understanding
    function() external{
        revert();
    }

    // Create ability to deposit Ether just not via the depositToken() method
        // Similar to depositToken() except depositToken uses tokens while ether is not a token
            // reduce amount of storage used by blockchain by using internal mapping storage of tokens; 
                // ether has no address but we will create functionality to where an empty address is ether in the tokens variable
    // Need payable function name modifier to accept ether in with metadata.
    function depositEther() payable public {
        // I think statement will be change later as he explains how to add ether as amount; can't be passed in as param as seen below
            // can pass in ether as metadata which using the value property in tests not the from property. 
                // Sets nested mapping of token for ether of the msg.sender equal to the specific token for the ETHER address with 
                    // ether being added. Will include amount from depositToken() method 
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        // Also, emit deposit event -> change token param to ETHER, amount param to msg.value, and balance to the ETHER balance of tokens mapping
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);

    }

    // Withdraw ether functionality
        // Do Opposite of what we did when depositing ether
    function withdrawEther(uint _amount) payable public {
        // Can't ask to withdraw more than ether than a specific user address has in tokens mapping ->
            // can't ask to withdraw 100 ether and only have 1 in tokens mapping -> test this as failure case
                // this should be rejected with error if user tries to withdraw more than they have 
        require(tokens[ETHER][msg.sender] >= _amount);
        // Test this in new describe('withdrawing ether') -> describe('success') -> it("withdraws Ether funds");
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        //Return ether back to original user -> is this from or not from the Token.sol smart contract?, I would 
            // assume not since it doesn't follow the 2 parameters that it should have if it was from Token.sol smart contract
        //! View this link to see address.transfer() in use: 
            //! https://medium.com/daox/three-methods-to-transfer-funds-in-ethereum-by-means-of-solidity-5719944ed6e9 
        msg.sender.transfer(_amount);
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    // Can deposit token import from above and any token as long as it follows
        // ERC-20 format
    function depositToken(address _token, uint _amount) public
    {
        //Don't allow Ether Deposits
        require(_token != ETHER);
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
    function withdrawToken(address _token, uint256 _amount) public{
        // Don't allow Ether Withdraws via this function -> use withdraw ether function if ether address
            // The order of these require() method checks allows for ether address checks in failure tests
                // to no fail on the insufficeint amount but on the incorrect address
        require(_token != ETHER);
        // Can't withdraw a token amount more than what is in the specific tokens mapping for the specific token for the specific user address 
        require(tokens[_token][msg.sender] >= _amount);
        // Explanation of 2 lines below:
            // Interesting concept, we’re returning the tokens back to the specific user address(or msg.sender/user1 in testing) 
                // because they’re withdrawing tokens. I think that this gives back tokens to the specific user address; 
                    //while the exchange smart contract has its tokens mapping(internal storing mechanism for exchange) 
                        // loses the tokens from the specific user address on the exchange.
        // This transfer method should return true -> and returns the tokens to the user address
        require(Token(_token).transfer(msg.sender, _amount));

        // subtract the token amount from the tokens mappping sotring the specific tokens that the specific user address has
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);

        //emit withdraw event similarly to withdrawEther() method
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // Check Balance Function -> reader function essentially due to view keyword?
    function balanceOf(address _token, address _user) public view returns(uint256)
    {
        // Just returns tokens mapping balance of specific token for specific user address
        // Create 2 dummy tests for checking balance of ether and our token in tokens mapping
        return tokens[_token][_user];
    }
}