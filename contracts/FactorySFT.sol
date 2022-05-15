// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "./SFT.sol";

/// @title The factory for deploy ERC721 contracts
/// @author TeamWestCoast
contract FactorySFT {

    uint public collectionCount;

    /// @dev mapping to get the contratcs address with an ID
    mapping (uint => address) public collections;

    /// @dev function to create a ERC1155 contract, call by the front
    /// @param _baseUri The link for the IPFS datas
    /// @param _salt salt for the create2 
    function createSFTCollection(string memory _baseUri, bytes32 _salt) external returns(address){ 
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