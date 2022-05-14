//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    address payable public immutable feeAccount;
    uint public immutable feePercent;
    uint public itemCount;
    uint public collectionCount;

    struct Item{
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
        string uri;
    }
    struct Collection{
        uint collectionId;
        address payable owner;
        address collectionAddress;
    }

    event Offered(uint itemId, address indexed nft, uint tokenId, uint price, address indexed seller);
    event Bought(uint itemId, address indexed nft, uint tokenId, uint price, address indexed seller, address indexed buyer);
    event Collections(uint collectionId, address indexed owner, address indexed collectionAddress);
    mapping(uint => Item) public items;
    mapping(uint => Collection) public collections;

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function makeItem(IERC721 _nft, uint _tokenId, uint _price, string memory _uri) external nonReentrant {
        require(_price > 0, "price must be greater than zero");
        itemCount++;
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        items[itemCount] = Item(itemCount, _nft, _tokenId, _price, payable(msg.sender), false, _uri );
        emit Offered(itemCount, address(_nft), _tokenId, _price, msg.sender);
    }

    function addCollection(address _collectionAddress) external nonReentrant {
        collectionCount++;
        collections[collectionCount] = Collection(collectionCount, payable(msg.sender), _collectionAddress);
        emit Collections(collectionCount, msg.sender, _collectionAddress);
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesnt exists");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        require(!item.sold, "item already sold");
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        item.sold = true;
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        emit Bought( _itemId, address(item.nft), item.tokenId, item.price, item.seller, msg.sender);
    }

    function sellItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesnt exists");
        _nft.transferFrom(msg.sender, address(this), _tokenId);
    }

    function getTotalPrice(uint _itemId) view public returns(uint) {
        return(items[_itemId].price*(100 + feePercent)/100);
    }
}