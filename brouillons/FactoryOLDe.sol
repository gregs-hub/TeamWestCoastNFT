// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// @author TeamWestCoast
contract FactoryOLDE is Ownable, Initializable {

    using Counters for Counters.Counter;
    string public baseURI;

    uint public tokenCount;
    uint collectionCount;
    mapping (uint => address) collections;

    // @dev The msg.sensder must be the first one who called the function
    modifier onlyAccounts() {
        require(msg.sender == tx.origin, "Not allowed origin of the call");
        _;
    }

    // @dev set state variable base URI : Can be set after deploy the contract in case of URI error

    function initialize(string memory _name, string memory _symbol, string memory _baseUri) public initializer {
        ERC721 nft = new ERC721(_name, _symbol);
        setBaseURI(_baseUri);
        collectionCount++;
        collections[collectionCount] = address(nft);
    }
    function setBaseURI(string memory _uri) public onlyOwner{
        baseURI = _uri;
    }

    function _baseURI() internal view returns (string memory) {
        return baseURI;
    }


}