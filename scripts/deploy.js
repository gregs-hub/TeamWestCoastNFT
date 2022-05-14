const { ethers } = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(1);
  const Factory = await ethers.getContractFactory("Factory"); 
  const factory = await Factory.deploy();
  const FactorySFT = await ethers.getContractFactory("FactorySFT"); 
  const factorySFT = await FactorySFT.deploy();
  const NFT = await ethers.getContractFactory("NFT");
  const SFT = await ethers.getContractFactory("SFT");
  
  saveFrontendFiles(factory , "Factory");
  saveFrontendFiles(factorySFT , "FactorySFT");
  saveFrontendFiles(marketplace , "Marketplace");
  saveFrontendFiles(NFT , "NFT");
  saveFrontendFiles(SFT , "SFT");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });