import { useState } from "react";
import { Row, Form, Button } from "react-bootstrap";
import { create as ipfsHttpClient } from 'ipfs-http-client';
import React from 'react';
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const CreateCollection = ({ state, account }) => {
    const [image, setImage] = useState('');
    const [artistName, setName] = useState('');
    const [artistSymbol, setSymbol] = useState('');

    const uploadToIPFS = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
            const result = await client.add(file);
            setImage(`https://ipfs.infura.io/ipfs/${result.path}`)
        }
    }

    const createCollection = async () => {
        if (!image || !artistName || !artistSymbol) return (<div>Pb pour createCollection</div>)
        try{
          const result = await client.add(JSON.stringify({image, artistName, artistSymbol}))
          deployThenList(result)
        } catch(error) {
          console.log("ipfs uri upload error: ", error)
        }
      }

      const deployThenList = async (result) => {

        const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
        console.log(state.factoryContract)
        await(await state.factoryContract.createNFTCollection(artistName, artistSymbol, uri)).wait();
        const id = await state.factoryContract.getCollectionId.call(); 
        console.log(id);
        const addr = await state.factoryContract.getCollection(id);
        console.log(id);
        console.log(addr);
        await(await state.marketContract.addCollection(addr)).wait();
      }

      return (
        <div className="container-fluid mt-5">
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
                  <div className="d-grid px-0">
                    <Button onClick={createCollection} variant="primary" size="lg">
                      Create Collection!
                    </Button>
                  </div>
                </Row>
              </div>
            </main>
          </div>
        </div>
      );
    }

export default CreateCollection;