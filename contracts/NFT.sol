// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// @author TeamWestCoast
contract NFT is ERC721, Ownable, ReentrancyGuard {

    using Counters for Counters.Counter;
    string public baseURI;

    uint public tokenCount;

    // uint[] private _teamShares = [33, 33, 34];

    // address[] private _team = [
    //     0x594DB4be0477A6835AA2608119eA5Dd6F45F1C94,
    //     0x594DB4be0477A6835AA2608119eA5Dd6F45F1C94,
    //     0x594DB4be0477A6835AA2608119eA5Dd6F45F1C94
    // ]; // PaymentSplitter(_team, _teamShares)

    constructor(string memory _name, string memory _symbol, string memory _baseUri)
        ERC721(_name, _symbol)
        
        ReentrancyGuard()
    {
        setBaseURI(_baseUri);
    }

    // @dev The msg.sensder must be the first one who called the function
    modifier onlyAccounts() {
        require(msg.sender == tx.origin, "Not allowed origin of the call");
        _;
    }

    // @dev set state variable base URI : Can be set after deploy the contract in case of URI error
    function setBaseURI(string memory _uri) public onlyOwner{
        baseURI = _uri;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // @dev Simple internal minting function
    function mint() external nonReentrant onlyOwner {
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
    }

    function totalSupply() public view returns(uint) {
        return tokenCount;
    }

}