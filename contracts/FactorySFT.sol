// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "./SFT.sol";
import "./Marketplace.sol";

// @author TeamWestCoast
contract FactorySFT {

    function createSFTCollection(string memory _baseUri, bytes32 _salt) external payable returns(address) {
        SFT sft = new SFT{salt: _salt}(_baseUri);
        sft.transferOwnership(msg.sender);
        return address(sft);
    }

}