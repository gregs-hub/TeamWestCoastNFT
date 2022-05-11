import './App.css';
import Navigation from "./components/Nav";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MarketplaceAbi from './contractsData/Marketplace.json';
import MarketplaceAddress from './contractsData/Marketplace-address.json';
import { ethers } from "ethers";
// import NFTAbi from './contractsData/NFT.json';
// import NFTAddress from './contractsData/NFT-address.json';
import FactoryAbi from './contractsData/Factory.json';
import FactoryAddress from './contractsData/Factory-address.json';
import AllItems from "./components/AllItems";
import Collections from "./components/Collections";
import CreateItem from "./components/CreateItem";
import CreateCollection from "./components/CreateCollection";
import Home from "./components/Home";
import MyItems from "./components/MyItems";
import { useState, useEffect } from "react";

function App() {
  
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nft, setNFT] = useState({});
  const [marketplace, setMarketplace] = useState({});
  const [factory, setFactory] = useState({});

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })

    loadContracts(signer);
  }
  const loadContracts = async (signer) => {
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
    setMarketplace(marketplace);
    // const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
    const factory = new ethers.Contract(FactoryAddress.address, FactoryAbi.abi, signer);
    setNFT(nft);
    setFactory(factory);
    setLoading(false);
  }

  return (
   <BrowserRouter>
     <Navigation web3Handler={web3Handler} account={account} />
     <Routes>
       <Route path='/' element={<Home />}/>
       <Route path='all-items' element={<AllItems nft={nft} marketplace={marketplace} account={account}/>} />
       <Route path='collections' element={<Collections nft={nft} marketplace={marketplace} factory={factory}/>} />
       <Route path='create-item' element={<CreateItem nft={nft} marketplace={marketplace}/>} />
       <Route path='create-collection' element={<CreateCollection nft={nft} marketplace={marketplace} factory={factory}/>} />
       <Route path='my-items' element={<MyItems nft={nft} marketplace={marketplace} account={account}/>} />
     </Routes>
   </BrowserRouter>
  );
}

export default App;