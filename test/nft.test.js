const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('ethers');

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("NFTeamWestCoastDapp", async function () {
    let deployer, addr1, addr2, nft, marketplace, factory;
    let feePercent = 10;
    let nftName    = 'NFTeamWestCoast'
    let nftSymbol  = 'NFTWC'
    let nftBaseUri = 'uri_test' 
    beforeEach(
        async () => {
            //Get contract factories
            const NFT         = await ethers.getContractFactory("NFT")
            const Marketplace = await ethers.getContractFactory("Marketplace");
            const Factory = await ethers.getContractFactory("Factory");

            //Get signers
            [deployer, addr1, addr2] = await ethers.getSigners();
            
            //Deploy contracts 
            nft         = await NFT.deploy(nftName, nftSymbol, nftBaseUri);
            marketplace = await Marketplace.deploy(feePercent);
            factory     = await Factory.deploy();
            //console.log('MP address : ' + marketplace.address)
        }
    )

    describe("Deployment", function() {
        it("Should see correct addresses", async function() {
            expect(`${process.env.PUBLIC_KEY_GANACHE1}`).to.equal(deployer.address)
            //console.log(" deployer : " + deployer.address);
            expect(`${process.env.PUBLIC_KEY_GANACHE2}`).to.equal(addr1.address)
            //console.log(" address 1 : " + addr1.address);
        })
        
        it("Should see correct name and symbol for NFT : "+nftName+" and "+nftSymbol, async function() {
            expect(await nft.name()).to.equal(nftName)
            expect(await nft.symbol()).to.equal(nftSymbol)
        })
        

    })

    describe("Minting NFT", function() {

        it("Should see correct owner for the deployer", async function() {
            await nft.connect(deployer).mint()
            let newOwner = await nft.ownerOf(1)
            expect(newOwner).to.equal(deployer.address);
        })

        it("Should see correct owner of the minted NFT", async function() {
            await nft.connect(deployer).mint()
            let newOwner = await nft.ownerOf(1)
            expect(newOwner).to.equal(deployer.address);
        })

        it("Should see correct balance after minting a NFT for the owner", async function() {
            await nft.connect(deployer).mint()
            expect(await nft.balanceOf(deployer.address)).to.equal(1);
        })

        it("Should see correct balance after minting a NFT for the owner", async function() {
            await nft.connect(deployer).mint()
            expect(await nft.balanceOf(deployer.address)).to.equal(1);
        })

        it("Should see correct tokenCount after minting 1 NFT for the owner", async function() {
            await nft.connect(deployer).mint()
            expect(await nft.getCount()).to.equal(1);
        })

        it("Should see correct tokenCount after minting 1 NFT for owner (=deployer)", async function() {
            await nft.connect(deployer).mint()
            expect(await nft.getCount()).to.equal(1);
        })

        it("Should see correct tokenCount after minting 2 NFT for owner", async function() {
            await nft.connect(deployer).mint()
            await nft.connect(deployer).mint()
            expect(await nft.getCount()).to.equal(2);
        })

        it("Should see correct URI after minting a NFT for deployer (only owner)", async function() {
            await nft.connect(deployer).mint()
            expect(await nft.baseURI()).to.equal(nftBaseUri);
        })
           
    })

    describe("Marketplace Tests", function () {
        beforeEach(async function () {
            // deployer mints an nft
            await nft.connect(deployer).mint()
            // deployer approves marketplace to spend nft
            await nft.connect(deployer).setApprovalForAll(marketplace.address, true)
          })

        const artistName1   = 'Gilles'
        const artistSymbol1 = 'GB'
        const artistUri1    = 'GB_URI'
        const artistName2   = 'Mathieu'
        const artistSymbol2 = 'MB'
        const artistUri2    = 'MB_URI'
      
        it("Should see owner of NFT with tokenid = 1 is the marketplace", async function() {
            // Owner of NFT should now be the marketplace
            let newOwner = await nft.ownerOf(1)
            expect(newOwner).to.equal(deployer.address);
        })

        it("Should see correct collection count after creating 1 collection", async function() {
            const hexaRandomString = ethers.utils.formatBytes32String((Math.random().toString(32)));
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName1, artistSymbol1, artistUri1, hexaRandomString)
            expect(await factory.collectionCount()).to.equal(1);
        })

        it("Should see correct collection count after creating 2 collections", async function() {
            const hexaRandomString = ethers.utils.formatBytes32String((Math.random().toString(32)));
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName1, artistSymbol1, artistUri1, hexaRandomString)
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName2, artistSymbol2, artistUri2, hexaRandomString)
            expect(await factory.collectionCount()).to.equal(2);
        })

        it("Should see ownership of a newly created collection to marketplace", async function() {
            const hexaRandomString = ethers.utils.formatBytes32String((Math.random().toString(32)));
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName1, artistSymbol1, artistUri1, hexaRandomString)
            const newNftAddress = await factory.getCollection(1)
            const newNftCreated = await ethers.getContractAt("NFT", newNftAddress);
            const ownerNewNft   = await newNftCreated.owner()
            const marketplaceAddress = marketplace.address
            //console.log("marketplaceAddress : " + marketplaceAddress);
            expect(ownerNewNft).to.equal(marketplaceAddress);
        })

        it("Should see ownership of a 2 newly created collections to marketplace", async function() {
            const hexaRandomString = ethers.utils.formatBytes32String((Math.random().toString(32)));
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName1, artistSymbol1, artistUri1, hexaRandomString)
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName2, artistSymbol2, artistUri2, hexaRandomString)
            const newNftAddress1 = await factory.getCollection(1)
            const newNftAddress2 = await factory.getCollection(2)

            const newNftCreated1 = await ethers.getContractAt("NFT", newNftAddress1);
            const ownerNewNft1   = await newNftCreated1.owner()
            const newNftCreated2 = await ethers.getContractAt("NFT", newNftAddress2);
            const ownerNewNft2   = await newNftCreated2.owner()
            const marketplaceAddress = marketplace.address
            expect(ownerNewNft1).to.equal(marketplaceAddress);
            expect(ownerNewNft2).to.equal(marketplaceAddress);
        })

        it("Should see correct collection count after adding 1 collection in the marketplace", async function() {
            const hexaRandomString = ethers.utils.formatBytes32String((Math.random().toString(32)));
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName1, artistSymbol1, artistUri1, hexaRandomString)
            const newNftAddress1 = await factory.getCollection(1)
            await marketplace.addCollection(newNftAddress1, artistUri1, true)
            const colCount = await marketplace.collectionCount()
            expect(colCount).to.equal(1)
        })

        it("Should see correct collection count after adding 2 collections in the marketplace", async function() {
            const hexaRandomString = ethers.utils.formatBytes32String((Math.random().toString(32)));
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName1, artistSymbol1, artistUri1, hexaRandomString)
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName2, artistSymbol2, artistUri2, hexaRandomString)
            const newNftAddress1 = await factory.getCollection(1)
            const newNftAddress2 = await factory.getCollection(1)
            await marketplace.addCollection(newNftAddress1, artistUri1, true)
            await marketplace.addCollection(newNftAddress2, artistUri2, true)
            const colCount = await marketplace.collectionCount()
            expect(colCount).to.equal(2)
        })

        it("Sould expect the correct price for the NFT created in the collection", async function() {
            const tokenId      = 1
            const collectionId = 1
            const nftPrice     = 1
            const hexaRandomString = ethers.utils.formatBytes32String((Math.random().toString(32)));
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName1, artistSymbol1, artistUri1, hexaRandomString)
            const newCollectionAddress1 = await factory.getCollection(1)
            await marketplace.addCollection(newCollectionAddress1, artistUri1, true)
            const newCollection = await ethers.getContractAt("NFT", newCollectionAddress1)
            await newCollection.setApprovalForAll(marketplace.address, true)
            await marketplace.makeItem(tokenId, collectionId, nftPrice, newCollectionAddress1, "nft_uri")
            const nftMinted = await marketplace.items(1)
            const price = BigNumber.from(nftMinted.price)
            expect(price).to.equal(toWei(nftPrice))
        })

        it("Sould expect the correct price with marketplace fee for the NFT created in the collection", async function() {
            const tokenId      = 1
            const collectionId = 1
            const nftPrice     = 1
            const hexaRandomString = ethers.utils.formatBytes32String((Math.random().toString(32)));
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName1, artistSymbol1, artistUri1, hexaRandomString)
            const newCollectionAddress1 = await factory.getCollection(1)
            await marketplace.addCollection(newCollectionAddress1, artistUri1, true)
            const newCollection = await ethers.getContractAt("NFT", newCollectionAddress1)
            await newCollection.setApprovalForAll(marketplace.address, true)
            await marketplace.makeItem(tokenId, collectionId, nftPrice, newCollectionAddress1, "nft_uri")
            const nftMinted = await marketplace.items(1)
            const feePercent = await marketplace.feePercent()
            //console.log('FEE PERCENT : ' + feePercent)
            //console.log('PRICE NFT : ' + nftPrice)

            const getTotalPrice = (priceNft, feePercent) => {
                return(priceNft*((100 + parseInt(feePercent))/100));
            }    
            let totalPrice = getTotalPrice(nftPrice, feePercent);

            const nftTotalPrice = await marketplace.getTotalPrice(1)
            //console.log('TOTAL PRICE SC = ' + fromWei(nftTotalPrice))
            //console.log('TOTAL PRICE = ' + totalPrice)
            
            expect(totalPrice).to.equal(parseFloat(fromWei(nftTotalPrice)))
        })
        

        it("Sould expect a newly created NFT is not sold yet", async function() {
            const tokenId      = 1
            const collectionId = 1
            const nftPrice     = 1
            const hexaRandomString = ethers.utils.formatBytes32String((Math.random().toString(32)));
            //Create NFTs Collection
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName1, artistSymbol1, artistUri1, hexaRandomString)
            //Get address of the collection
            const newCollectionAddress1 = await factory.getCollection(1)
            await marketplace.addCollection(newCollectionAddress1, artistUri1, true)
            // Get the instance of the newly NFT smart contract
            const newCollection = await ethers.getContractAt("NFT", newCollectionAddress1)
            await newCollection.setApprovalForAll(marketplace.address, true)
            // Mint the NFT
            await marketplace.makeItem(tokenId, collectionId, nftPrice, newCollectionAddress1, "nft_uri")
            const nftMinted = await marketplace.items(1)
            expect(nftMinted.sold).to.equal(false)
        })

        it("Should expect that it's impossible to buy a NFT that does not exist", async function() {
            const tokenId      = 1
            const collectionId = 1
            const nftPrice     = 1
            const hexaRandomString = ethers.utils.formatBytes32String((Math.random().toString(32)));
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName1, artistSymbol1, artistUri1, hexaRandomString)
            const newCollectionAddress1 = await factory.getCollection(1)
            await marketplace.addCollection(newCollectionAddress1, artistUri1, true)
            const newCollection = await ethers.getContractAt("NFT", newCollectionAddress1)
            await newCollection.setApprovalForAll(marketplace.address, true)
            await marketplace.makeItem(tokenId, collectionId, nftPrice, newCollectionAddress1, "nft_uri")
            const tokenIdNotMinted = 2
            await expect(
                marketplace.connect(addr1).purchaseItem(tokenIdNotMinted, {value: toWei(2)})
              ).to.be.revertedWith("item doesnt exists");            
        })

        it("Should expect that a NFT minted has its property 'sold' to true when someone buy it", async function() {
            const tokenId      = 1
            const collectionId = 1
            const nftPrice     = 1
            const hexaRandomString = ethers.utils.formatBytes32String((Math.random().toString(32)));
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName1, artistSymbol1, artistUri1, hexaRandomString)
            const newCollectionAddress1 = await factory.getCollection(1)
            await marketplace.addCollection(newCollectionAddress1, artistUri1, true)
            const newCollection = await ethers.getContractAt("NFT", newCollectionAddress1)
            await newCollection.setApprovalForAll(marketplace.address, true)
            await marketplace.makeItem(tokenId, collectionId, nftPrice, newCollectionAddress1, "nft_uri")
            //let totalPriceInWei = await marketplace.getTotalPrice(1);
            //console.log('totalPriceInWei : ' + totalPriceInWei)
            //console.log('totalPriceInETH : ' + fromWei(totalPriceInWei))
            await marketplace.connect(addr1).purchaseItem(1, { value: toWei(2) })
            const nftMinted = await marketplace.items(1)
            expect(nftMinted.sold).to.equal(true)
        })

        it("Should expect that it's not possible to buy a NFT with not enough ETH", async function() {
            const tokenId      = 1
            const collectionId = 1
            const nftPrice     = 1
            const hexaRandomString = ethers.utils.formatBytes32String((Math.random().toString(32)));
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName1, artistSymbol1, artistUri1, hexaRandomString)
            const newCollectionAddress1 = await factory.getCollection(1)
            await marketplace.addCollection(newCollectionAddress1, artistUri1, true)
            const newCollection = await ethers.getContractAt("NFT", newCollectionAddress1)
            await newCollection.setApprovalForAll(marketplace.address, true)
            await marketplace.makeItem(tokenId, collectionId, nftPrice, newCollectionAddress1, "nft_uri")
            await expect(
                marketplace.connect(addr1).purchaseItem(tokenId, {value: toWei(1)})
              ).to.be.revertedWith("not enough ether to cover item price and market fee");  
        })
    })


})

