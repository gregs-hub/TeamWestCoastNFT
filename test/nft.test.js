const { expect } = require("chai");
const { ethers } = require("hardhat");


const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("NFTeamWestCoastDapp", async function () {
    let deployer, addr1, nft, marketplace, factory;
    let feePercent = 1;
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
            [deployer, addr1] = await ethers.getSigners();
            
            //Deploy contracts 
            nft         = await NFT.deploy(nftName, nftSymbol, nftBaseUri);
            marketplace = await Marketplace.deploy(feePercent);
            factory     = await Factory.deploy();
            //console.log('MP address : ' + marketplace.address)
        }
    )

    describe("Deployment", function() {
        it.skip("Should see correct addresses", async function() {
            expect(`${process.env.PUBLIC_KEY_GANACHE1}`).to.equal(deployer.address)
            //console.log(" deployer : " + deployer.address);
            expect(`${process.env.PUBLIC_KEY_GANACHE2}`).to.equal(addr1.address)
            //console.log(" address 1 : " + addr1.address);
        })
        
        it.skip("Should see correct name and symbol for NFT : "+nftName+" and "+nftSymbol, async function() {
            expect(await nft.name()).to.equal(nftName)
            expect(await nft.symbol()).to.equal(nftSymbol)
        })
        

    })

    describe("Minting", function() {

        it.skip("Should see correct owner for the deployer", async function() {
            await nft.connect(deployer).mint()
            let newOwner = await nft.ownerOf(1)
            expect(newOwner).to.equal(deployer.address);
        })

        it.skip("Should see correct owner of the minted NFT for only owner", async function() {
            await nft.connect(deployer).mint()
            let newOwner = await nft.ownerOf(1)
            expect(newOwner).to.equal(deployer.address);
        })

        it.skip("Should see correct balance after minting a NFT for only owner", async function() {
            await nft.connect(deployer).mint()
            expect(await nft.balanceOf(deployer.address)).to.equal(1);
        })

        it.skip("Should see correct balance after minting a NFT for only owner", async function() {
            await nft.connect(deployer).mint()
            expect(await nft.balanceOf(deployer.address)).to.equal(1);
        })

        it.skip("Should see correct tokenCount after minting 1 NFT for only owner", async function() {
            await nft.connect(deployer).mint()
            expect(await nft.totalSupply()).to.equal(1);
        })

        it.skip("Should see correct tokenCount after minting 1 NFT for owner (=deployer)", async function() {
            await nft.connect(deployer).mint()
            expect(await nft.totalSupply()).to.equal(1);
        })

        it.skip("Should see correct tokenCount after minting 2 NFT for owner", async function() {
            await nft.connect(deployer).mint()
            await nft.connect(deployer).mint()
            expect(await nft.totalSupply()).to.equal(2);
        })

        it.skip("Should see correct URI after minting a NFT for deployer (only owner)", async function() {
            await nft.connect(deployer).mint()
            expect(await nft.baseURI()).to.equal(nftBaseUri);
        })
           
    })

    describe("Marketplace", function () {
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
      
        it.skip("Should see owner of NFT with tokenid = 1 is the marketplace", async function() {
            // Owner of NFT should now be the marketplace
            let newOwner = await nft.ownerOf(1)
            expect(newOwner).to.equal(deployer.address);
        })

        it("Should see correct collection count after creating 1 collection", async function() {
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName1, artistSymbol1, artistUri1)
            expect(await factory.collectionCount()).to.equal(1);
        })

        it("Should see correct collection count after creating 2 collections", async function() {
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName1, artistSymbol1, artistUri1)
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName2, artistSymbol2, artistUri2)
            expect(await factory.collectionCount()).to.equal(2);
        })

        it("Should see ownership of a newly created collection to marketplace", async function() {
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName1, artistSymbol1, artistUri1)
            const newNftAddress = await factory.getCollection(1)
            const newNftCreated = await ethers.getContractAt("NFT", newNftAddress);
            const ownerNewNft   = await newNftCreated.owner()
            const marketplaceAddress = marketplace.address
            //console.log("marketplaceAddress : " + marketplaceAddress);
            expect(ownerNewNft).to.equal(marketplaceAddress);
        })

        it("Should see ownership of a 2 newly created collections to marketplace", async function() {
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName1, artistSymbol1, artistUri1)
            await factory.connect(addr1).createNFTCollection(marketplace.address, artistName2, artistSymbol2, artistUri2)
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

    })

})

