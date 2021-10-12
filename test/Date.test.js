// Chai is a BDD/TDD assertion library for NodeJS and the browser that can be paired with any JS testing framework (i.e. Mocha)
const { expect } = require("chai");
// Solidity assertion library for Ethereum smart contract testing to make sure your contracts behaves as expected
const { expectRevert } = require('@openzeppelin/test-helpers');

// the aritifacts.require method returns a contract abstraction and the name we add between the parenthesis should match the contract definition and can only contain one contract
const DateToken = artifacts.require("Date"); 

// chai-as-promised extends Chai for asserting facts about promises
require("chai").use(require("chai-as-promised")).should();

// create a new Date token for testing
contract("Date", (accounts) => {
    let date;
    // before() runs before all tests regardless where this line is defined
    before(async () => {
        date = await DateToken.new();
    });

    // describe() allows us to group our tests
    // describe() takes two arguments, the first is the name of the test group, and the second is a callback function
    // it() is used for an individual test case
    // it() takes two arguments, a string explaining what the test should do, and a callback function which contains our actual test
    describe("Deployed Date", async () => {
        // check the owner of the token
        it("has an owner", async () => {
            let owner = await date.owner();
            expect(owner).to.equal(accounts[0]);
        });

        // check the name of the token
        it("has a name", async () => {
            let name = await date.name();
            expect(name).to.equal("Date");
        });

        // check the symbol of the token
        it("has a symbol", async () => {
            let symbol = await date.symbol();
            expect(symbol).to.equal("DATE");
        });

        // check the Base URI of the token
        it("has correct tokenURI", async () => {
            let tokenURI = await date.tokenURI(0);
            expect(tokenURI).to.equal("http://localhost/token/0");
        });

        // check the Origin of the token is as defined in the metadata
        it("gifts the owner the origin of time", async () => {
            let owner = await date.ownerOf(0);
            expect(owner).to.equal(accounts[0]);

            let meta = await date.get(0);
            expect(meta[0].toNumber()).to.equal(1);
            expect(meta[1].toNumber()).to.equal(1);
            expect(meta[2].toNumber()).to.equal(1);
            expect(meta[3].toNumber()).to.equal(4);
            expect(meta[4].toString()).to.equal("ORIGIN");
        });

        // checks the for the correct values of two token in our wallet
        it("gifts the owner national cats day", async () => {
            let owner = await date.ownerOf(2005, 10, 29);
            expect(owner).to.equal(accounts[0]);

            let title = await date.titleOf(2005, 10, 29);
            expect(title).to.equal("All cats reunite!");

            title = await date.titleOf((2005-1)*372 + (10-1)*31 + 29-1);
            expect(title).to.equal("All cats reunite!");
        });

        it("gifts the owner Youtube", async () => {
            let owner = await date.ownerOf(2005, 4, 23);
            expect(owner).to.equal(accounts[0]);

            let title = await date.titleOf(2005, 4, 23);
            expect(title).to.equal("Me at the zoo");
        });
    });

    describe("Converting a timestamp into a date", async () => {
        it("returns 01.01.1970 for timestamp 0", async () => {
            let meta = await date.timestampToDate(0);
            expect(meta[0].toNumber()).to.equal(1970);
            expect(meta[1].toNumber()).to.equal(1);
            expect(meta[2].toNumber()).to.equal(1);
        });

        it("returns 01.01.1970 for timestamp 23:59:59 (86399)", async () => {
            let meta = await date.timestampToDate(86399);
            expect(meta[0].toNumber()).to.equal(1970);
            expect(meta[1].toNumber()).to.equal(1);
            expect(meta[2].toNumber()).to.equal(1);
        });

        it("returns 02.01.1970 for timestamp 00:00:00 (86400)", async () => {
            let meta = await date.timestampToDate(86400);
            expect(meta[0].toNumber()).to.equal(1970);
            expect(meta[1].toNumber()).to.equal(1);
            expect(meta[2].toNumber()).to.equal(2);
        });

        it("returns 28.02.1970 for timestamp 23:59:59 (5097599)", async () => {
            let meta = await date.timestampToDate(5097599);
            expect(meta[0].toNumber()).to.equal(1970);
            expect(meta[1].toNumber()).to.equal(2);
            expect(meta[2].toNumber()).to.equal(28);
        });

        it("returns 01.03.1970 for timestamp 00:00:00 (5097600)", async () => {
            let meta = await date.timestampToDate(5097600);
            expect(meta[0].toNumber()).to.equal(1970);
            expect(meta[1].toNumber()).to.equal(3);
            expect(meta[2].toNumber()).to.equal(1);
        });

        it("returns 28.02.1972 for timestamp 23:59:59 (68169599)", async () => {
            let meta = await date.timestampToDate(68169599);
            expect(meta[0].toNumber()).to.equal(1972);
            expect(meta[1].toNumber()).to.equal(2);
            expect(meta[2].toNumber()).to.equal(28);
        })

        it("returns 29.02.1972 for timestamp 00:00:00 (68169600)", async () => {
            let meta = await date.timestampToDate(68169600);
            expect(meta[0].toNumber()).to.equal(1972);
            expect(meta[1].toNumber()).to.equal(2);
            expect(meta[2].toNumber()).to.equal(29);
        });

        it("returns 29.02.1972 for timestamp 23:59:59 (68255999)", async () => {
            let meta = await date.timestampToDate(68255999);
            expect(meta[0].toNumber()).to.equal(1972);
            expect(meta[1].toNumber()).to.equal(2);
            expect(meta[2].toNumber()).to.equal(29);
        });

        it("returns 01.03.1972 for timestamp 00:00:00 (68256000)", async () => {
            let meta = await date.timestampToDate(68256000);
            expect(meta[0].toNumber()).to.equal(1972);
            expect(meta[1].toNumber()).to.equal(3);
            expect(meta[2].toNumber()).to.equal(1);
        });

        it("returns 17.03.2021 for timestamp (1615993858)", async () => {
            let meta = await date.timestampToDate(1615993858);
            expect(meta[0].toNumber()).to.equal(2021);
            expect(meta[1].toNumber()).to.equal(3);
            expect(meta[2].toNumber()).to.equal(17);
        });

        it("returns 12.06.2086 for timestamp (3674678400)", async () => {
            let meta = await date.timestampToDate(3674678400);
            expect(meta[0].toNumber()).to.equal(2086);
            expect(meta[1].toNumber()).to.equal(6);
            expect(meta[2].toNumber()).to.equal(12);
        });

        it("returns 12.06.3086 for timestamp (35231587200)", async () => {
            let meta = await date.timestampToDate(35231587200);
            expect(meta[0].toNumber()).to.equal(3086);
            expect(meta[1].toNumber()).to.equal(6);
            expect(meta[2].toNumber()).to.equal(12);
        });
    });

    // the web3.utils package provides utility functions for Ethereum dApps and other web3.js packages
    // the BN.js library calculates with big numbers in JS
    // the toWei library converts any ether value value into wei
    let price = web3.utils.toBN(web3.utils.toWei('10', 'finney'));

    describe("Minting a date", async () => {    
        let ownerBalanceBefore;
        let buyerBalanceBefore;

        before(async ()=> {
            // the web3.eth package allows you to interact with an Ethereum blockchain and Ethereum smart contracts
            // getBalance() gets the balance of an address at a given block
            // note that accounts[0] is the owner of token (i.e. myself)
            // and accounts[1] is the buyer of the token (i.e. minter)
            ownerBalanceBefore = await web3.eth.getBalance(accounts[0]);
            ownerBalanceBefore = web3.utils.toBN(ownerBalanceBefore);

            buyerBalanceBefore = await web3.eth.getBalance(accounts[1]);
            buyerBalanceBefore = web3.utils.toBN(buyerBalanceBefore);
        });

        let reciept;
        let transaction;

        // create a new Date token and transaction receipt
        // creates a transaction matching the given transaction hash receipt.tx
        it("creates a token", async () => {
            reciept = await date.claim(1912, 6, 23, "Birthday Alan Turing", { from: accounts[1], value: price });
            transaction = await web3.eth.getTransaction(reciept.tx);
        });

        // the owner of this new Date token is set to the owner of who claimed the token
        it("transfers ownership to the caller", async () => {
            let owner = await date.ownerOf(1912, 6, 23);
            expect(owner).to.equal(accounts[1]);
        });

        // sets the title of this new Date token
        it("sets the title", async () => {
            let note = await date.titleOf(1912, 6, 23);
            expect(note).to.equal("Birthday Alan Turing");
        });

        // obtain the gas price from the transaction
        it("costs 10 finneys plus gas to mint", async () => {
            let buyerBalanceAfter = await web3.eth.getBalance(accounts[1]);
            buyerBalanceAfter = web3.utils.toBN(buyerBalanceAfter);
            let gasCost = web3.utils.toBN(transaction.gasPrice * reciept.receipt.gasUsed);
            let expectedBuyerBalance = buyerBalanceBefore.sub(price).sub(gasCost);
            expect(buyerBalanceAfter.toString()).to.equal(expectedBuyerBalance.toString());
        });

        // transfer the final balance to accounts[0]
        it("10 finneys are transferred to the owners account", async () => {
            let ownerBalanceAfter = await web3.eth.getBalance(accounts[0]);
            ownerBalanceAfter = web3.utils.toBN(ownerBalanceAfter);
            let expectedOwnerBalance = ownerBalanceBefore.add(price);
            expect(ownerBalanceAfter.toString()).to.equal(expectedOwnerBalance.toString());
        });

        // Date token (1972, 6, 23) cannot be minted again (even with a different title)
        it("prevents it from being minted again", async() => {
            await expectRevert(
                date.claim(1912, 6, 23, "Met my dog", { from: accounts[2], value: price }),
                "Reason given: ERC721: token already minted."
            );
        });
    });

    // if minter tries to mint a new Date token (claim) without paying, throws error
    describe("Trying to mint a date without paying", async () => {
        it("fails", async () => {
            await expectRevert(
                date.claim(2000, 1, 1, "The millenium!"),
                "claiming a date costs 10 finney"
            );
        });
    });

    // fails if minter tries to claim a token with a future date as its metadata
    describe("Trying to mint a future date", async () => {
        it("fails for one day in the future", async () => {
            // getBlock() returns a block matching the block number or block hash or the string "earliest", "latest" or "pending"
            // pending is the currently mined block (including pending transactions) 
            let pendingBlock = await web3.eth.getBlock("pending");
            let tomorrow = new Date((pendingBlock.timestamp + 86400) * 1000);
            await expectRevert(
                date.claim(tomorrow.getFullYear(), tomorrow.getMonth()+1, tomorrow.getDate(), "Tomorrow never dies!", { from: accounts[2], value: price }),
                "a date from the future can't be claimed"
            );
        });

        it("fails for one month in the future", async () => {
            let pendingBlock = await web3.eth.getBlock("pending");
            let today = new Date((pendingBlock.timestamp) * 1000);
            await expectRevert(
                date.claim(today.getFullYear(), today.getMonth()+2, today.getDate(), "Flaky time test!", { from: accounts[2], value: price }),
                "a date from the future can't be claimed"
            );
        });

        it("fails for one year in the future", async () => {
            let pendingBlock = await web3.eth.getBlock("pending");
            let today = new Date((pendingBlock.timestamp) * 1000);
            await expectRevert(
                date.claim(today.getFullYear()+1, today.getMonth()+1, today.getDate(), "In a years time …", { from: accounts[2], value: price }),
                "a date from the future can't be claimed"
            );
        });
    });

    // changing the title of a Date token if you're the owner vs if you're not
    describe("Changing the title of a date", async () => {
        it("works if you are the owner of this date", async () => {
            // changes by finding token ID
            await date.changeTitleOf(0, "This is the beginning");
            let title = await date.titleOf(0);
            expect(title).to.equal("This is the beginning");

            // changes by finding token year, month, day
            await date.changeTitleOf(1986, 6, 12, "HBD2ME");
            title = await date.titleOf(1986, 6, 12);
            expect(title).to.equal("HBD2ME");
        });

        it("reverts if you aren't the owner of this date", async () => {
            await expectRevert(
                date.methods["changeTitleOf(uint256,string)"](0, "this will fail", { from: accounts[1] }),
                "only the owner of this date can change its title"
            );
            let title = await date.titleOf(0);
            expect(title).to.equal("This is the beginning");

            await expectRevert(
                date.changeTitleOf(1986, 6, 12, "this will fail", { from: accounts[1] }),
                "only the owner of this date can change its title"
            );
            title = await date.titleOf(1986, 6, 12);
            expect(title).to.equal("HBD2ME");
        });
    });

    // changing the base URI if you're the owner vs if you're not
    describe("Changing the BaseURI", async () => {
        it("works if you are the owner of the contract", async () => {
            await date.setBaseURI("https://www.test.io/");
            let tokenURI = await date.tokenURI(0);
            expect(tokenURI).to.equal("https://www.test.io/0");
        });

        it("reverts if you are not the owner of the contract", async () => {
            await expectRevert(
                date.setBaseURI("https://www.test.io/", { from: accounts[1] }),
                "caller is not the owner"
            );
        });
    });
});