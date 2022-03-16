# nfts
I developed a NFT named DATE. My website provides a UI that allows users to mint their own DATE token for every retired date in the calendar. To achieve this, I set up a dev environment that connects to the Ethereum blockchain to develop a Solidity smart contract for my DATE token. This smart contract will store the information for each DATE in the blockchain. I used web3 JS, Truffle JS, OpenZeppelin, MetaMask, and Ganache.

Smart Contract Purpose:
- Create a ERC721 smart contract for our Date token where token name is 'Date' and token symbol is 'DATE'.
- We want user to be able to add a title to each Date token.
- We want to store the year, month, day, title, and color on the blockchain.

Development Cycle of our Smart Contract:
- We will implement a function. 
- We will implement a unit test to make sure our function works properly. Truffle JS comes with a testing framework which will make sure our smart contract works before it gets deployed.

Important keyword definitions:
- ABI: (The Contract Application Binary Interface) the standard way to interact with contracts in the Ethereum ecosystem, both from outside the blockchain and for contract-to-contract interaction. Data is encoded according to its type, as described in this specification. The encoding is not self describing and thus requires a schema in order to decode.
- constant: (a modifier) the function won't modify the contract storage (not used anymore; we now use 'view' and 'pure').
- external: (a modifier) the function can only be called externally (not internally).
- Ganache: used to quickly fire up a personal Ethereum blockchain which you can use to run tests, execute commands, and inspect state while controlling how the chain operates.
- Infura: an HTTP API that gives you access to a node inside the ethereum blockchain.
- internal: (a modifier) the function can only be called within the contract and any derived contracts (similar to protected keyword).
- OpenZeppelin: a library for implementing different types of ERC tokens.
- view: (a subset of constant) the function will read the storage without modifying the storage
- private: (a modifier) the function can only be called within the contract (NOT by any derived contracts). 
- public: (a modifier) the function can be called externally and internally (all access).
- pure: (a subset of constant) the function will not read nor write the storage and only local variables will be used; the return value will be determined by its parameters
- require: (error handling) used to check for conditions and throw an exception if the conditions are not met.
- testnets: networks used by protocol developers to test both protocol upgrades as well as potential smart contracts in a production-like environment before deployment to mainnet. OpenSea has a test system running which uses the Rinkeby testnet. We need to own some ether on the Rinkeby testnet. To get some ether on a testnet called a "faucet". Rinkeby uses "authenticated faucet" which means you need to make a social post with your wallet address to verify your identity. Then you post the URL on faucet.rinkeby.io. After a few mins, you will get some ether in your wallet.
- Truffle JS: a development environment, testing framework and asset pipeline for Ethereum. Built-in smart contract compilation, linking, deployment and binary management. Automated contract testing with Mocha and Chai.
- web3 JS: a collection of libraries that allow you to interact with a local or remote ethereum node using HTTP, IPC or WebSocket.
- wei: the smallest ethere unit, and you should always make calculations in wei and convert only for display reasons.