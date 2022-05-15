import { useState } from "react";
import { Row, Form, Button } from "react-bootstrap";
import { create as ipfsHttpClient } from 'ipfs-http-client';
import React from 'react';
import { ethers } from "ethers";
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const CreateCollection = ({ state, account, setCollection, collection }) => {
    const [image, setImage] = useState('');
    const [artistName, setName] = useState('');
    const [artistSymbol, setSymbol] = useState('');
    const [NFT, setNFT] = useState('');

    const uploadToIPFS = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
            const result = await client.add(file);
            setImage(`https://ipfs.infura.io/ipfs/${result.path}`)
        }
    }

    const createCollection = async () => {
        if (!image || !artistName || !artistSymbol) return <div>Pb pour createCollection</div>
        try{
          const result = await client.add(JSON.stringify({image, artistName, artistSymbol, NFT}))
          deployThenList(result)
        } catch(error) {
          console.log("ipfs uri upload error: ", error)
        }
      }

      const deployThenList = async (result) => {
        const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
        //const hexaRandomString = ethers.utils.formatBytes32String((Math.random().toString(32)));
        if (NFT == "SFT") {
          await(await state.factorySFTContract.createSFTCollection(uri)).wait();
          const id = await state.factorySFTContract.getCount();
          const addr = state.factorySFTContract.getCollection(id);
          await(await state.marketContract.addCollection(addr, uri, true)).wait();
        } else {
          await(await state.factoryContract.createNFTCollection(artistName, artistSymbol, uri)).wait();
          const id = await state.factoryContract.getCount();
          console.log(id)
          const addr = await state.factoryContract.getCollection(id);
          console.log(addr)
          await(await state.marketContract.addCollection(addr, uri, false)).wait();
          }
        
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
                  <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Artist Name" />
                  <Form.Control onChange={(e) => setSymbol(e.target.value)} size="lg" required as="textarea" placeholder="Collection Name" />
                  <Form.Control onChange={(e) => setNFT(e.target.value)} as="select" size="lg">
                    <option key='NFT' value="DEFAULT">NFT</option>
                    <option key='SFT' value="SFT">SFT</option>
                  </Form.Control>
                  <div className="d-grid px-0">
                  {!image || !artistName || !artistSymbol 
                    ? <Button disabled onClick={createCollection} variant="primary" size="lg">
                          Create Collection!
                      </Button>
                    
                    : <Button onClick={createCollection} variant="primary" size="lg">
                          Create Collection!
                    </Button>}
                    
              
                  </div>
                </Row>
              </div>
            </main>
          </div>}
        </div>
      );
    }

export default CreateCollection;