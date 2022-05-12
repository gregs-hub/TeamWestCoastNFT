// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "./NFT.sol";

// @author TeamWestCoast
contract Factory {

    uint collectionId;

    mapping (uint => NFT) collections;
    // mapping(address => address[]) public collectionsByArtist; // An artist can create multiple NFT collections

    // @dev Factory to create NFT smart contract
    function createNFTCollection(string memory _artistName, string memory _artistSymbol, string memory _baseUri) public payable{
       NFT nft = new NFT(_artistName, _artistSymbol, _baseUri);
       collectionId++;
       collections[collectionId] = nft;
    }

    function getCollection(uint _id) public view returns(NFT) {
        return collections[_id];
    }
    function getCollectionId() public view returns(uint) {
        return collectionId;
    }

    // // @dev Get the collections by artist
    // function getCollectionsByArtist(address _address) external view returns(address[] memory) {
    //     return collectionsByArtist[_address];
    // }
}