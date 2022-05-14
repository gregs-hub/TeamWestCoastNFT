import './App.css';
import Navigation from "./components/Nav";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MarketplaceAbi from './contractsData/Marketplace.json';
import { ethers } from "ethers";
import MarketplaceAddress from './contractsData/Marketplace-address.json';
import FactoryAbi from './contractsData/Factory.json';
import FactoryAddress from './contractsData/Factory-address.json';
import AllItems from "./components/AllItems";
import Collections from "./components/Collections";
import CreateItem from "./components/CreateItem";
import ItemsByCollection from "./components/ItemsByCollection";
import CreateCollection from "./components/CreateCollection";
import MyItems from "./components/MyItems";
import { useState, useEffect } from "react";
import React from 'react';

function App() {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const factoryInstance = new ethers.Contract(FactoryAddress.address, FactoryAbi.abi, signer);
  const marketInstance = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
  const [collections, setCollections] = useState([]);
  const [collectionExplore, setCollectionExplore] = useState({});
  const [account, setAccount] = useState(null);
  const [state, setState] = useState({ 
    marketContract: marketInstance, 
    factoryContract: factoryInstance
  });

    const web3Handler = async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0])
      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
      })
  
      window.ethereum.on('accountsChanged', async function (accounts) {
        setAccount(accounts[0]);
        await web3Handler();
      })
    }
    useEffect(() => {
      (async function () {
        try {
          window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
          })
      
          window.ethereum.on('accountsChanged', async function (accounts) {
            const accountTS = accounts[0].toUpperCase();
            setAccount(accountTS);
            window.location.reload();
          })
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accountTS = accounts[0].toUpperCase();
      setAccount(accountTS);
    } catch (error) {
      console.error(error);
    }})();}, [])

  return (
   <BrowserRouter>
     <Navigation state={state} account={account} web3Handler={web3Handler} />
     <Routes>
       <Route path='/' element={<AllItems state={state} account={account}/>} />
       <Route path='collections' element={<Collections state={state} collections={collections}
        setCollections={setCollections} collectionExplore={collections} setCollectionExplore={setCollectionExplore}/>} />
       <Route path='create-item' element={<CreateItem state={state} setAccount={setAccount}
       collections={collections} setCollections={setCollections} account={account}/>} />
       <Route path='create-collection' element={<CreateCollection state={state} account={account}/>} />
       <Route path='my-items' element={<MyItems state={state} account={account} setAccount={setAccount}/>} />
       <Route path='collections/items-by-collection' element={<ItemsByCollection state={state} collectionExplore={collectionExplore} account={account}/>} />
     </Routes>
   </BrowserRouter>
  );
}

export default App;