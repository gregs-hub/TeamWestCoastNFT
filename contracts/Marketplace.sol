//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    address payable public immutable feeAccount;
    uint public immutable feePercent;
    uint public itemCount;
    uint public collectionCount;
    uint public rate = 1000000000000000000;

    struct Item{
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable owner;
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
        uint _newPrice = _price * rate;
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        items[itemCount] = Item(itemCount, _nft, _tokenId, _newPrice, payable(msg.sender), false, _uri );
        emit Offered(itemCount, address(_nft), _tokenId, _newPrice, msg.sender);
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
        item.owner.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        item.sold = true;
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        item.owner = payable(msg.sender);
        emit Bought( _itemId, address(item.nft), item.tokenId, item.price, item.owner, msg.sender);
    }

    function sellItem(uint _itemId, uint _price) external payable nonReentrant {
        Item storage item = items[_itemId];
        require(item.owner == msg.sender, "You are not the owner of the NFT");
        require(_itemId > 0 && _itemId <= itemCount, "item doesnt exists");
        require(item.sold, "item already on the marketplace");
        item.sold = false;
        item.price = _price * rate;
        item.nft.transferFrom(msg.sender, address(this), item.tokenId);
        emit Offered(item.itemId, address(item.nft), item.tokenId, item.price, msg.sender);
    }

    function changePrice(uint _itemId, uint _newPrice) external payable nonReentrant {
        Item storage item = items[_itemId];
        require(item.owner == msg.sender, "You are not the owner of the NFT");
        require(_itemId > 0 && _itemId <= itemCount, "item doesnt exists");
        require(!item.sold, "item not on the marketplace");
        item.price = _newPrice;
        emit Offered(item.itemId, address(item.nft), item.tokenId, _newPrice, msg.sender);
    }

    function removeFromMarketplace(uint _itemId) external payable nonReentrant {
        Item storage item = items[_itemId];
        require(item.owner == msg.sender, "You are not the owner of the NFT");
        require(_itemId > 0 && _itemId <= itemCount, "item doesnt exists");
        require(!item.sold, "item not on the marketplace");
        item.sold = true;
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
    }

    function getTotalPrice(uint _itemId) view public returns(uint) {
        return(items[_itemId].price*(100 + feePercent)/100);
    }
}