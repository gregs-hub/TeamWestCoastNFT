// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "./NFT.sol";

// @author TeamWestCoast
contract Factory {

    uint public collectionCount;
    mapping (uint => address) public collections;

    function createNFTCollection(address _marketplace, string memory _artistName, string memory _artistSymbol, string memory _baseUri, bytes32 _salt) external returns(address){ 
        NFT nft = new NFT{salt: _salt}(_artistName, _artistSymbol, _baseUri);
        collectionCount++;
        collections[collectionCount] = address(nft);
        nft.transferOwnership(_marketplace);
        return collections[collectionCount];
     }

     function getCollection(uint _id) external view returns(address){
         return collections[_id];
     }

     function getCount() external view returns(uint){
         return collectionCount;
     }

}