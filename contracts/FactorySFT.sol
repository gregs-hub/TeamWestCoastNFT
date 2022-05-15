// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "./SFT.sol";

// @author TeamWestCoast
contract FactorySFT {

    uint public collectionCount;
    mapping (uint => address) public collections;

    function createSFTCollection(address _marketplace, string memory _baseUri, bytes32 _salt) external returns(address){ 
        SFT sft = new SFT{salt: _salt}(_baseUri);
        collectionCount++;
        collections[collectionCount] = address(sft);
        sft.transferOwnership(msg.sender);
        return collections[collectionCount];
     }

     function getCollection(uint _id) external view returns(address){
         return collections[_id];
     }

     function getCount() external view returns(uint){
         return collectionCount;
     }

}