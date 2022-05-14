// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "./NFT.sol";
import "./Marketplace.sol";

// @author TeamWestCoast
contract Factory {

    // @dev Factory to create NFT smart contract
    function createNFTCollection(string memory _artistName, string memory _artistSymbol, string memory _baseUri, bytes32 _salt) external payable returns(address){
        NFT nft = new NFT{salt: _salt}(_artistName, _artistSymbol, _baseUri);
        nft.transferOwnership(msg.sender);
        return address(nft);
     }

}