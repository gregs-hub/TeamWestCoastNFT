// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "./NFT.sol";

// @author TeamWestCoast
contract Factory {

    uint collectionId;

    mapping (uint => address) collections;
    mapping(address => address[]) private collectionsByArtist; // An artist can create multiple NFT collections

    // @dev Factory to create NFT smart contract
    function createNFTCollection(string memory _artistName, string memory _artistSymbol, string memory _baseUri) external payable{
       NFT nft = new NFT(_artistName, _artistSymbol, _baseUri);
       collectionsByArtist[msg.sender].push(payable(nft));
       collectionId++;
       collections[collectionId] = payable(nft);
    }

    function getCollection(uint _id) external view returns(address) {
        return collections[_id];
    }

    // @dev Get the collections by artist
    function getCollectionsByArtist(address _address) external view returns(address[] memory) {
        return collectionsByArtist[_address];
    }
}