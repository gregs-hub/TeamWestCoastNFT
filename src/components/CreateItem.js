import React, { useState, useEffect } from "react";
import { Row, Form, Button } from "react-bootstrap";
import { create as ipfsHttpClient } from 'ipfs-http-client';
import NFTAbi from '../contractsData/NFT.json';
import SFTAbi from '../contractsData/SFT.json';
import { ethers } from "ethers";
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const CreateItem = ({ state, collections, setCollections, account, setAccount }) => {

    const [image, setImage] = useState('');
    const [price, setPrice] = useState(null);
    const [amount, setAmount] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [collectionSelect, setCollectionSelect] = useState('');

    const uploadToIPFS = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
            const result = await client.add(file);
            setImage(`https://ipfs.infura.io/ipfs/${result.path}`)
        }
    }

    const loadMarketplaceCollections = async () => {
      const collectionCountTemp = await state.marketContract.collectionCount();
      const collectionCount = collectionCountTemp.toNumber();
      let collections = [];

      for (let i = 1; i <= collectionCount; i++) {
        const collection = await state.marketContract.collections(i);
        const collectionOwner = await collection.owner.toUpperCase();
        const collectionAddress = await collection.collectionAddress;
        const uri = await collection.uri;
        const response = await fetch(uri);
        const metadata = await response.json();
        console.log(collection.sft.toString())
        collections.push({
            collectionId: collection.collectionId,
            isSFT: collection.sft,
            artistName: metadata.artistName,
            artistSymbol: metadata.artistSymbol,
            image: metadata.image,
            owner: collectionOwner,
            address: collectionAddress
        })
      }
        setCollections(collections);
      
    }

    useEffect(() => {
      (async function () {
        try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accountTS = accounts[0].toUpperCase();
      setAccount(accountTS);
      loadMarketplaceCollections();
    } catch (error) {
      console.error(error);
    }})();}, [])


    const createNFT = async () => {
        if (collectionSelect[3] == "SFT"){
          try{
            const collectionId = collectionSelect[0];
          const owner = collections.owner;
          const collectionArtist = collectionSelect[1];
          const collectionSymbol = collectionSelect[2];
          const collectionIsSFT = collectionSelect[3];
          const collectionAddr = collectionSelect[4];
          const result = await client.add(JSON.stringify({image, price, name, 
            description, collectionSelect, collectionId, collectionArtist, collectionSymbol, collectionIsSFT, collectionAddr, owner, amount}))
            mintThenList(result)
          } catch(error) {
            console.log("ipfs uri upload error: ", error)
          }
        } else if (collectionSelect[3] == "NFT"){ 
          try{
            const collectionId = collectionSelect[0];
            const owner = collections.owner;
            console.log(owner)
          const collectionArtist = collectionSelect[1];
          const collectionSymbol = collectionSelect[2];
          const collectionIsSFT = collectionSelect[3];
          const collectionAddr = collectionSelect[4];
          const result = await client.add(JSON.stringify({image, price, name, description, collectionSelect,
             collectionId, collectionArtist, collectionSymbol, collectionIsSFT, owner, collectionAddr}))
            mintThenList(result)
          } catch(error) {
            console.log("ipfs uri upload error: ", error)
          }
        }
      }

      const createSFT = async () => {
        if (!image || !price || !name || !description || !collectionSelect || !amount) return
        try{
          const collectionId = collectionSelect[0];
          const result = await client.add(JSON.stringify({image, price, name, description, collectionSelect, amount}))
          mintThenList(result)
        } catch(error) {
          console.log("ipfs uri upload error: ", error)
        }
      }

      const mintThenList = async (result) => {
        const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = collectionSelect[4];
        console.log(addr)
        console.log(collectionSelect[3])
        console.log(collectionSelect)
        if (collectionSelect[3] == "NFT"){
          const nft = new ethers.Contract(addr, NFTAbi.abi, signer);
          await(await nft.mint()).wait();
          const idTemp = await nft.getCount();
          const tokenId = idTemp.toNumber();
          console.log(state.marketContract.address);
          await(await nft.setApprovalForAll(state.marketContract.address, true)).wait();
          await(await state.marketContract.makeItem(tokenId, collectionSelect[0], price, nft.address, uri)).wait();
        } else if (collectionSelect[3] == "SFT"){
          const sft = new ethers.Contract(addr, SFTAbi.abi, signer);
          console.log(sft)
          await(await sft.mint(amount)).wait();
          const idTemp = await sft.getCount();
          const tokenId = idTemp.toNumber() + 1;
          await(await sft.setApprovalForAll(state.marketContract.address, true)).wait();
          await(await state.marketContract.makeItemSFT(tokenId, collectionSelect[0], amount, price, sft.address, uri)).wait();

        } else { return<div>PB SFTNFT</div>}
        
       }
  
      return (
        <div className="container-fluid mt-5">
          {!account ?  <div>Please connect your wallet</div> :
          <div className="row">
            <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
              <div className="content mx-auto">
                <Row className="g-4">
                  <Form.Control
                    type="file"
                    required
                    name="file"
                    onChange={uploadToIPFS}
                  />
                  
                  <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
                  <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
                  <Form.Control onChange={(e) => setCollectionSelect(e.target.value.split(' ; '))} as="select" size="lg">

                    <option value="DEFAULT">Select your Collection</option>
                    {collections.map((collection, idx) => {

                       if (collection.owner == account) {
                         if(collection.isSFT) {
                            return <option key={collection.collectionId.toNumber()}>{collection.collectionId.toNumber()} ; {collection.artistName} ; {collection.artistSymbol} ; SFT ; {collection.address}</option> 
                       } else { return <option key={collection.collectionId.toNumber()}>{collection.collectionId.toNumber()} ; {collection.artistName} ; {collection.artistSymbol} ; NFT ; {collection.address}</option>}}
                            else return null
                      
                      })}

                  </Form.Control>
                  {collectionSelect[3] == "SFT" ? 
                  <Form.Control onChange={(e) => setAmount(e.target.value)} size="lg" required type="text" placeholder="Amount" />
                  : <div></div>}
                  <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
                  <div className="d-grid px-0">
                  {(!image || !price || !name || !description || !collectionSelect)    
                     ? <Button disabled onClick={createNFT} variant="primary" size="lg">
                          Create & List NFT!
                      </Button>
                    : <Button onClick={createNFT} variant="primary" size="lg">
                      Create & List NFT!
                  </Button>  
                        }
                  </div>
                </Row>
              </div>
            </main>
          </div>}
        </div>
      );
    }

export default CreateItem;