// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// @author TeamWestCoast
contract SFT is ERC1155, Ownable, ReentrancyGuard {

    using Counters for Counters.Counter;
    string public baseURI;

    uint public tokenCount;

    constructor(string memory _baseUri) ERC1155(_baseUri) ReentrancyGuard() {

    }        

    // @dev The msg.sensder must be the first one who called the function
    modifier onlyAccounts() {
        require(msg.sender == tx.origin, "Not allowed origin of the call");
        _;
    }

    // @dev Simple internal minting function
    function mint(uint _amount) external nonReentrant {
        tokenCount++;
        _mint(msg.sender, tokenCount, _amount, "");
    }

    function totalSupply() public view returns(uint) {
        return tokenCount;
    }

}