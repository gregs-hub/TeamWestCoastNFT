const { expect } = require("chai");
const { ethers } = require("hardhat");


const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("NFTeamWestCoastDapp", async function () {
    let deployer, addr1, addr2, nft, marketplace;
    let feePercent = 1;
    let nftName    = 'NFTeamWestCoast'
    let nftSymbol  = 'NFTWC'
    let nftBaseUri = 'uri_test' 
    beforeEach(
        async () => {
            //Get contract factories
            const NFT         = await ethers.getContractFactory("NFT")
            const Marketplace = await ethers.getContractFactory("Marketplace");

            //Get signers
            [deployer, addr1, addr2] = await ethers.getSigners();
            
            //Deploy contracts 
            nft         = await NFT.deploy(nftName, nftSymbol, nftBaseUri);
            marketplace = await Marketplace.deploy(feePercent);
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

    describe("Minting", function() {

        it("Should see correct owner for the deployer", async function() {
            await nft.connect(deployer).mint()
            let newOwner = await nft.ownerOf(1)
            expect(newOwner).to.equal(deployer.address);
        })

        it("Should see correct owner of the minted NFT for only owner", async function() {
            await nft.connect(deployer).mint()
            let newOwner = await nft.ownerOf(1)
            expect(newOwner).to.equal(deployer.address);
        })

        it("Should see correct balance after minting a NFT for only owner", async function() {
            await nft.connect(deployer).mint()
            expect(await nft.balanceOf(deployer.address)).to.equal(1);
        })

        it("Should see correct balance after minting a NFT for only owner", async function() {
            await nft.connect(deployer).mint()
            expect(await nft.balanceOf(deployer.address)).to.equal(1);
        })

        it("Should see correct tokenCount after minting 1 NFT for only owner", async function() {
            await nft.connect(deployer).mint()
            expect(await nft.totalSupply()).to.equal(1);
        })

        it("Should see correct tokenCount after minting 1 NFT for owner (=deployer)", async function() {
            await nft.connect(deployer).mint()
            expect(await nft.totalSupply()).to.equal(1);
        })

        it("Should see correct tokenCount after minting 2 NFT for owner", async function() {
            await nft.connect(deployer).mint()
            await nft.connect(deployer).mint()
            expect(await nft.totalSupply()).to.equal(2);
        })

        it("Should see correct URI after minting a NFT for deployer (only owner)", async function() {
            await nft.connect(deployer).mint()
            expect(await nft.baseURI()).to.equal(nftBaseUri);
        })
           
    })

    describe("Marketplace", function () {
        beforeEach(async function () {
            // addr1 mints an nft
            await nft.connect(deployer).mint()
            // addr1 approves marketplace to spend nft
            await nft.connect(deployer).setApprovalForAll(marketplace.address, true)
          })

        it("Should see owner of NFT with tokenid = 1 is the marketplace", async function() {
            // Owner of NFT should now be the marketplace
            let newOwner = await nft.ownerOf(1)
            expect(newOwner).to.equal(deployer.address);
        })
  
    })

})

