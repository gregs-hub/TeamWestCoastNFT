// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "./SFT.sol";

// @author TeamWestCoast
contract FactorySFT {

    uint public collectionCount;
    mapping (uint => address) public collections;

    // function createNFTCollection(string memory _artistName, string memory _artistSymbol, string memory _baseUri, bytes32 _salt) external payable returns(address){
    //     collectionCount++;
    //     NFT nft = new NFT{salt: _salt}(_artistName, _artistSymbol, _baseUri);
    //     collections[collectionCount] = address(nft);
    //     nft.transferOwnership(payable(msg.sender));
    //     return collections[collectionCount];
    //  }

     function createSFTCollection(string memory _baseUri) external {
        SFT sft = new SFT(_baseUri);
        collectionCount++;
        collections[collectionCount] = address(sft);
        sft.transferOwnership(msg.sender);
     }

     function getCollection(uint _id) external view returns(address){
         return collections[_id];
     }

     function getCount() external view returns(uint){
         return collectionCount;
     }

}