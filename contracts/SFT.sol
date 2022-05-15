// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

/// @author TeamWestCoast
/// @title The erc721 contract who is called by the factory
contract SFT is ERC1155, Ownable, ReentrancyGuard {

    string public baseURI;
    uint public tokenCount;

    constructor(string memory _baseUri) ERC1155(_baseUri) ReentrancyGuard() {}
      
    function mint(uint _amount) external nonReentrant onlyOwner {
        tokenCount++;
        _mint(msg.sender, tokenCount, _amount, "");
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155) returns (bool){
        return super.supportsInterface(interfaceId);
    }

    function getCount() public view returns (uint) {
        return tokenCount;
    }

}