const Token = artifacts.require("Token");
const Exchange = artifacts.require("Exchange");

module.exports = async function(deployer) {
    // gets all accounts from  ganache by web3 
        // how do we know the feeAccount is the [0] of accounts?
    const accounts = await web3.eth.getAccounts()

    await deployer.deploy(Token);

    const feeAccount = accounts[0];
    const feePercent = 10;
    // When deploying, need to pass in what in the constructor, for exhcange that include the feeAccount and feePercent
        // feeAccount is passed in as string and will bee accessed by web3; feePercent is just passed in as number 10
    await deployer.deploy(Exchange, feeAccount, feePercent);
}