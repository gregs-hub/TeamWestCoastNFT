//SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./NFT.sol";
import "./SFT.sol";


contract Marketplace is ReentrancyGuard, IERC721Receiver {
    address payable public immutable feeAccount;
    uint public immutable feePercent;
    uint public itemCount;
    uint public collectionCount;
    uint public rate = 1000000000000000000;

    struct Item{
        uint itemId; 
        uint tokenId;
        uint collectionId;
        uint price;
        uint amount;
        NFT nft;
        address payable owner;
        bool sold;
        bool isSFT;
        string uri;
    }
        
    struct Collection{
        uint collectionId;
        address payable owner;
        address collectionAddress;
        bool sft;
        string uri;
    }

    event Offered(uint itemId, address indexed nft, uint collectionId, uint tokenId, uint price, address indexed seller);
    event Bought(uint itemId, address indexed nft, uint tokenId, uint price, address indexed seller, address indexed buyer);
    event Collections(uint collectionId, address indexed owner, address indexed collectionAddress, bool isSFT, string uri);

    mapping(uint => Item) public items;
    mapping(uint => Collection) public collections;
    mapping(address => address[]) public collectionsByArtist; // An artist can create multiple NFT collections

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function makeItem(uint _tokenId, uint _collectionId, uint _price, NFT _nft, string memory _uri) external nonReentrant {
        require(_price > 0, "price must be greater than zero");
        require(collections[_collectionId].owner == payable(msg.sender), "you are not the collection owner");
        itemCount++;
        uint _newPrice = _price * rate;
        _nft.mint();
        items[itemCount] = Item(itemCount, _tokenId, _collectionId, _newPrice, 1, _nft, payable(msg.sender), false, false, _uri );
        emit Offered(itemCount, address(_nft), _collectionId, _tokenId, _newPrice, msg.sender);
    }

    function makeItemSFT(uint _tokenId, uint _collectionId, uint16 _amount, uint _price, NFT _nft, string memory _uri) external nonReentrant {
        require(_price > 0, "price must be greater than zero");
        require(collections[_collectionId].owner == payable(msg.sender), "you are not the collection owner");
        itemCount++;
        uint _newPrice = _price * rate;
        items[itemCount] = Item(itemCount, _tokenId, _collectionId, _newPrice, _amount, _nft, payable(msg.sender), false, true, _uri );
        emit Offered(itemCount, address(_nft), _collectionId, _tokenId, _newPrice, msg.sender);
    }

    function addCollection(address _collectionAddress, string memory _uri, bool _isSFT) external nonReentrant {
        collectionsByArtist[msg.sender].push(_collectionAddress);
        collectionCount++;
        collections[collectionCount] = Collection(collectionCount, payable(msg.sender), _collectionAddress, _isSFT, _uri);
        emit Collections(collectionCount, msg.sender, _collectionAddress, _isSFT, _uri);
        
    }

     function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
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
        emit Offered(item.itemId, address(item.nft), item.collectionId, item.tokenId, item.price, msg.sender);
    }

    function changePrice(uint _itemId, uint _newPrice) external payable nonReentrant {
        Item storage item = items[_itemId];
        require(item.owner == msg.sender, "You are not the owner of the NFT");
        require(_itemId > 0 && _itemId <= itemCount, "item doesnt exists");
        require(!item.sold, "item not on the marketplace");
        item.price = _newPrice * rate;
        emit Offered(item.itemId, address(item.nft), item.collectionId, item.tokenId, _newPrice, msg.sender);
    }

    function removeFromMarketplace(uint _itemId) external payable nonReentrant {
        Item storage item = items[_itemId];
        require(item.owner == msg.sender, "You are not the owner of the NFT");
        require(_itemId > 0 && _itemId <= itemCount, "item doesnt exists");
        require(!item.sold, "item not on the marketplace");
        item.sold = true;
        NFT(item.nft).transferFrom(address(this), msg.sender, item.tokenId);
    }

    function getTotalPrice(uint _itemId) view public returns(uint) {
        return(items[_itemId].price*(100 + feePercent)/100);
    }

    function getCollectionId() public view returns(uint) {
        return collectionCount;
    }

    function getCollection(uint _id) public view returns(address) {
        return collections[_id].collectionAddress;
    }
}