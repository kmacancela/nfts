// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// library for secure smart contract development
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// provides a basic access control mechanism, where there is an account (an owner) that can be granted exclusive access (i.e. who can mint tokens, vote on proposals, freeze transfers, etc) to specific functions. By default, the owner account will be the one that deploys the contract.
import "@openzeppelin/contracts/access/Ownable.sol";

contract Date is Ownable, ERC721 {

    struct Metadata {
        uint16 year;
        uint8 month;
        uint8 day;
        uint8 color;
        string title;
    }

    // we are mapping the token id to the metadata. T his is how we store data inside the blockchain.
    mapping(uint256 => Metadata) id_to_date;

    // defined our token name and token symbol 
    // the constructor is executed when we deploy the smart contract to the blockchain
    // here we are executing several Date tokens for my wallet
    constructor() public ERC721("Date", "DATE") {
        _setBaseURI("http://localhost/token/");

        mint(1, 1, 1, 4, "ORIGIN");
        (uint16 now_year, uint8 now_month, uint8 now_day) = timestampToDate(now);
        mint(now_year, now_month, now_day, 4, "Date Token Start");
        mint(1920, 8, 26, 6, "About time women got to vote!");
        mint(2005, 10, 29, 5, "All cats reunite!");
        mint(1999, 11, 15, 1, "Your neopet is dying...");
        mint(2005, 4, 23, 2, "Me at the zoo");
        mint(1969, 7, 20, 3, "One small step for man");
        mint(1977, 7, 15, 0, "I Love New York");
        mint(1903, 12, 17, 7, "Off to the sky!");
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _setBaseURI(baseURI);
    }

    // will create a new Date token
    // since it's defined as internal, only the smart contract itself can call it 
    function mint(uint16 year, uint8 month, uint8 day, uint8 color, string memory title) internal {
        uint256 tokenId = id(year, month, day);
        
        id_to_date[tokenId] = Metadata(year, month, day, color, title);
        _safeMint(msg.sender, tokenId);
    }

    // this function gets called to create a Date token for user through the dApp (external)
    // takes same parameters as mint function except color because the color is randomly chosen 
    // since we defined as payable, user will need to pay a fee in order to create this Date token (cost is defined as 10 finney)
    function claim(uint16 year, uint8 month, uint8 day, string calldata title) external payable {
        // if user does not pay the 10 finney fee to create the token, then they will get the message below
        require(msg.value == 10 finney, "claiming a date costs 10 finney");

        // we check the year, month, and day parameters for validity
        (uint16 now_year, uint8 now_month, uint8 now_day) = timestampToDate(now);
        if ((year > now_year) || 
            (year == now_year && month > now_month) || 
            (year == now_year && month == now_month && day > now_day)) {
            revert("a date from the future can't be claimed");
        }

        // we generate a random color based off the below probabilities 
        uint8 color;
        uint256 r = pseudoRNG(year, month, day, title) % 1000000;
        if (r < 1000) {
            color = 7;
        } else if (r < 6000) {
            color = 6;
        } else if (r < 16000) {
            color = 5;
        } else if (r < 66000) {
            color = 4;
        } else if (r < 166000) {
            color = 3;
        } else if (r < 366000) {
            color = 2;
        } else if (r < 666000) {
            color = 1;
        } else {
            color = 0;
        }

        // we now add them to the mint function
        mint(year, month, day, color, title);
        // we transfer the 10 finney to my wallet
        payable(owner()).transfer(10 finney);
    }
}