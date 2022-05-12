import React, { useState } from "react";
import { Row, Form, Button } from "react-bootstrap";
import { create as ipfsHttpClient } from 'ipfs-http-client';
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const CreateItem = ({ state }) => {

    const [image, setImage] = useState('');
    const [price, setPrice] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [collection, setCollection] = useState('');

    const uploadToIPFS = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
            const result = await client.add(file);
            setImage(`https://ipfs.infura.io/ipfs/${result.path}`)
        }
    }

    const createNFT = async () => {
        if (!image || !price || !name || !description || !collection) return (<div>probleme createNFt</div>)
        try{
          const result = await client.add(JSON.stringify({image, price, name, description, collection}))
          mintThenList(result)
        } catch(error) {
          console.log("ipfs uri upload error: ", error)
        }
      }
      const mintThenList = async (result) => {
        const uri = `https://ipfs.infura.io/ipfs/${result.path}`
        // mint nft 

        // await(await nft.mint(uri)).wait()
        // // get tokenId of new nft 
        // const id = await nft.tokenCount()
        // // approve marketplace to spend nft
        // await(await nft.setApprovalForAll(marketplace.address, true)).wait()
        // // add nft to marketplace
        // // const listingPrice = ethers.utils.parseEther(price.toString())
        // await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
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
                  <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
                  <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
                  <Form.Control onChange={(e) => setCollection(e.target.value)} as="select" size="lg">
                    <option selected>Select Collection (optional)</option>
                    <option>1</option>
                    <option>2</option>
                  </Form.Control>
                  <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
                  <div className="d-grid px-0">
                    <Button onClick={createNFT} variant="primary" size="lg">
                      Create & List NFT!
                    </Button>
                  </div>
                </Row>
              </div>
            </main>
          </div>
        </div>
      );
    }

export default CreateItem;