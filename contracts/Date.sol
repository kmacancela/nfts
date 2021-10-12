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

        // Origin is the global variable in Solidity which returns the address of the account that sent the transaction
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

    function ownerOf(uint16 year, uint8 month, uint8 day) public view returns(address) {
        // the ownerOf() function finds the provided token ID in the _tokenOwner map and returns the address of its owner
        return ownerOf(id(year, month, day));
    }

    function id(uint16 year, uint8 month, uint8 day) pure internal returns(uint256) {
        // numDaysInMonth is a function we have defined 
        require(1 <= day && day <= numDaysInMonth(month, year));
        return (uint256(year)-1)*372 + (uint256(month)-1)*31 + uint256(day)-1;
    }
    
    // we can get a Date token
    // reads the metadata that is associate to a Date token ID 
    function get(uint256 tokenId) external view returns (uint16 year, uint8 month, uint8 day, uint8 color, string memory title) {
        require(_exists(tokenId), "token not minted");
        Metadata memory date = id_to_date[tokenId];
        year = date.year;
        month = date.month;
        day = date.day;
        color = date.color;
        title = date.title;
    }

    // gets the title of the Date token by its token ID
    function titleOf(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), "token not minted");
        Metadata memory date = id_to_date[tokenId];
        return date.title;
    }

    // gets the title of the Date token by the year, month, and day
    function titleOf(uint16 year, uint8 month, uint8 day) external view returns (string memory) {
        require(_exists(id(year, month, day)), "token not minted");
        Metadata memory date = id_to_date[id(year, month, day)];
        return date.title;
    }

    // changes the title of the Date token if it exists
    // since we are using a external modifier, this function can only be called 
    function changeTitleOf(uint16 year, uint8 month, uint8 day, string memory title) external {
        require(_exists(id(year, month, day)), "token not minted");
        changeTitleOf(id(year, month, day), title);
    }

    // changes the title of the Date token 
    // this is only possible if the owner of the Date token is calling this endpoint 
    function changeTitleOf(uint256 tokenId, string memory title) public {
        require(_exists(tokenId), "token not minted");
        require(ownerOf(tokenId) == msg.sender, "only the owner of this date can change its title");
        id_to_date[tokenId].title = title;
    }

    // helper function to determine if leap year
    function isLeapYear(uint16 year) public pure returns (bool) {
        require(1 <= year, "year must be bigger or equal 1");
        return (year % 4 == 0) 
            && (year % 100 == 0)
            && (year % 400 == 0);
    }

    // helper function to determine the number of days in a given month & year, given that a correct month and year are provided as parameters
    function numDaysInMonth(uint8 month, uint16 year) public pure returns (uint8) {
        require(1 <= month && month <= 12, "month must be between 1 and 12");
        require(1 <= year, "year must be bigger or equal 1");

        if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
            return 31;
        }
        else if (month == 2) {
            return isLeapYear(year) ? 29 : 28;
        }
        else {
            return 30;
        }
    }

    // returns a year, month, and day from the timestamp provided as a parameter
    function timestampToDate(uint timestamp) public pure returns (uint16 year, uint8 month, uint8 day) {
        uint z = timestamp / 86400 + 719468;
        uint era = (z >= 0 ? z : z - 146096) / 146097;
        uint doe = z - era * 146097;
        uint yoe = (doe - doe/1460 + doe/36524 - doe/146096) / 365;
        uint doy = doe - (365*yoe + yoe/4 - yoe/100);
        uint mp = (5*doy + 2)/153;

        day = uint8(doy - (153*mp+2)/5 + 1);
        month = mp < 10 ? uint8(mp + 3) : uint8(mp - 9);
        year = uint16(yoe + era * 400 + (month <= 2 ? 1 : 0));
    }

    // keccak256: a cryptographic function built into solidity. This function takes in any amount of inputs and converts it to a unique 32 byte hash 
    // block.timestamp: the timestamp of the current block in seconds since the epoch
    // block.difficulty: the difficulty of the current block
    function pseudoRNG(uint16 year, uint8 month, uint8 day, string memory title) internal view returns (uint256) {
        return uint256(keccak256(abi.encode(block.timestamp, block.difficulty, year, month, day, title)));
    }
}