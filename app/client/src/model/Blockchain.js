import Web3 from 'web3';
import DateToken from "../contracts/Date.json";

let contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

// using web3 to connect to the blockchain 
let web3 = undefined;
let account = undefined;
let contract = undefined;

export function tokenIdFromDate(date) {
    return (date.getFullYear()-1)*372 + date.getMonth()*31 + date.getDate() - 1;
}

export async function initWeb3() {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      return true;
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
      return true;
    }

    return false;
}

export function isWeb3Ready() {
    return web3 !== undefined;
}

export async function connectToBlockchain() {
    const accounts = await web3.eth.getAccounts();

    contract = new web3.eth.Contract(DateToken.abi, contractAddress);
    account = accounts[0];
}

export function isConnectedToBlockchain() {
    return contract !== undefined && account !== undefined;
}

// how we will load all the minted Date tokens from the blockchain in order to show them in the calendar
export async function loadAllMintedDates() {
    if (!isConnectedToBlockchain) {
        return {};
    }

    // we get the total supply of Date tokens
    let allMintedDates = {};
    const totalSupply = await contract.methods.totalSupply().call();

    // and iterate over each Date token 
    // and call tokenByIndex() (implemented in our ERC721  smart contract)
    for (let i=0; i < totalSupply; i++) {
        const tokenId = await contract.methods.tokenByIndex(i).call();
        const token = await loadToken(tokenId);
        allMintedDates[tokenId.toString()] = token;
    }

    return allMintedDates;
}

// how we start a transaction if user wants to claim a Date token
export function claimDate(date, title) {
    // claim() is implemented in our smart contract
    // send() (web3 method) will transfer 10 finney. Metamask will pop up when user hits Submit where user will be able to send the transaction to start the smart contract minting process and get their Date token
    return contract.methods.claim(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        title,
    ).send({
        from: account, 
        value: Web3.utils.toWei('10', 'finney')
    });
}

// for loading a Date token
export async function loadToken(tokenId) {
    // get() will get our metadata struct
    const tokenData = await contract.methods.get(tokenId).call();
    const owner = await contract.methods.ownerOf(tokenId).call();

    // we use the info we got to add to this JS object to hand over to the UI
    return {
        tokenId: tokenId,
        date: (() => { 
          let d = new Date();
          d.setUTCDate(tokenData[2]);
          d.setUTCMonth(tokenData[1] - 1);
          d.setFullYear(tokenData[0]);
          return d;
        })(),
        color: tokenData[3],
        title: tokenData[4].toString(),
        owner: owner
    }
}

export async function loadTokenForDate(date) {
    let token = await loadToken(tokenIdFromDate(date));
    return token;
}