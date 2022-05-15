// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "./NFT.sol";

/// @title The factory for deploy ERC721 contracts
/// @author TeamWestCoast

contract Factory {

    uint public collectionCount;

    /// @dev mapping to get the contratcs address with an ID
    mapping (uint => address) public collections;

    /// @dev function to create a ERC721 contract, call by the front
    /// @param _artistName Name of the collection artist
    /// @param _artistSymbol Name for the collection
    /// @param _baseUri The link for the IPFS datas
    /// @param _salt salt for the create2 
    function createNFTCollection(string memory _artistName, string memory _artistSymbol, string memory _baseUri, bytes32 _salt) external returns(address){ 
        NFT nft = new NFT{salt: _salt}(_artistName, _artistSymbol, _baseUri);
        collectionCount++;
        collections[collectionCount] = address(nft);
        nft.transferOwnership(msg.sender);
        return collections[collectionCount];
     }

     function getCollection(uint _id) external view returns(address){
         return collections[_id];
     }

     function getCount() external view returns(uint){
         return collectionCount;
     }

}