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
            console.log('MP address : ' + marketplace.address)
        }
    )

    describe("Deployment", function() {
        it.skip("Should see correct addresses", async function() {
            expect(`${process.env.PUBLIC_KEY_GANACHE1}`).to.equal(deployer.address)
            //console.log(" deployer : " + deployer.address);
            expect(`${process.env.PUBLIC_KEY_GANACHE2}`).to.equal(addr1.address)
            //console.log(" address 1 : " + addr1.address);
            expect(`${process.env.PUBLIC_KEY_GANACHE3}`).to.equal(addr2.address)
            //console.log(" address 2 : " + addr2.address);
        })
        
        it.skip("Should see correct name and symbol for NFT : "+nftName+" and "+nftSymbol, async function() {
            expect(await nft.name()).to.equal(nftName)
            expect(await nft.symbol()).to.equal(nftSymbol)
        })
        

    })

    describe("Minting", function() {

        it("Should see correct owner of the minted NFT for address1", async function() {
            await nft.connect(addr1).mint()
            let newOwner = await nft.ownerOf(1)
            expect(newOwner).to.equal(addr1.address);
        })

        it.skip("Should see correct owner of the minted NFT for address2", async function() {
            await nft.connect(addr2).mint()
            let newOwner = await nft.ownerOf(1)
            expect(newOwner).to.equal(addr2.address);
        })

        it.skip("Should see correct balance after minting a NFT for address1", async function() {
            await nft.connect(addr1).mint()
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
        })

        it.skip("Should see correct balance after minting a NFT for address2", async function() {
            await nft.connect(addr2).mint()
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
        })

        it.skip("Should see correct tokenCount after minting 1 NFT for address1", async function() {
            await nft.connect(addr1).mint()
            expect(await nft.totalSupply()).to.equal(1);
        })

        it.skip("Should see correct tokenCount after minting 1 NFT for address2", async function() {
            await nft.connect(addr2).mint()
            expect(await nft.totalSupply()).to.equal(1);
        })

        it.skip("Should see correct tokenCount after minting 2 NFT for address1 and address2", async function() {
            await nft.connect(addr1).mint()
            await nft.connect(addr2).mint()
            expect(await nft.totalSupply()).to.equal(2);
        })

        it("Should see correct URI after minting a NFT for address1", async function() {
            await nft.connect(addr1).mint()
            expect(await nft.baseURI()).to.equal(nftBaseUri);
        })
           
    })

    describe("Marketplace", function () {
        beforeEach(async function () {
            // addr1 mints an nft
            await nft.connect(addr1).mint()
            // addr1 approves marketplace to spend nft
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
          })

        it("Should see owner of NFT with tokenid = 1 is the marketplace", async function() {
            // Owner of NFT should now be the marketplace
            let newOwner = await nft.ownerOf(1)
            expect(newOwner).to.equal(addr1.address);
        })
  
    })

})

