# nfts
Mission: Set up a dev environment for the Ethereum blockchain to develop my first smart contract by using web3 JS, Truffle JS, and Ganache.

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
- internal: (a modifier) the function can only be called within the contract and any derived contracts (similar to protected keyword).
- view: (a subset of constant) the function will read the storage without modifying the storage
- private: (a modifier) the function can only be called within the contract (NOT by any derived contracts). 
- public: (a modifier) the function can be called externally and internally (all access).
- pure: (a subset of constant) the function will not read nor write the storage and only local variables will be used; the return value will be determined by its parameters
- require: (error handling) used to check for conditions and throw an exception if the conditions are not met.
- wei: the smallest ethere unit, and you should always make calculations in wei and convert only for display reasons.