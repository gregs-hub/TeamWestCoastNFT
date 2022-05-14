import { useState, useEffect } from 'react'
import { Row, Col, Card, Form, Button} from 'react-bootstrap';
import { ethers } from "ethers";
import React from 'react';

const MyItems = ({ state, account, setAccount }) => {
    const [loading, setLoading] = useState(true)
    const [listedItems, setListedItems] = useState([])
    const [price, setPrice] = useState(null)

    const loadListedItems = async () => {

      const itemCountTemp = await state.marketContract.itemCount();
      const itemCount = itemCountTemp.toNumber();
      let listedItems = [];
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accountTS = accounts[0].toUpperCase();
      for (let indx = 1; indx <= itemCount; indx++) {
        const i = await state.marketContract.items(indx);

        if (i.owner.toUpperCase() == accountTS) {
          const contractAddr = i.nft;
          const uri = i.uri;
          const response = await fetch(uri);
          const metadata = await response.json();
          const totalPrice = await state.marketContract.getTotalPrice(i.itemId)

          let item = {
            totalPrice,
            price: i.price,
            itemId: i.itemId,
            sold: i.sold,
            tokenId: i.tokenId,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            collectionAddr: contractAddr,
            collectionId: metadata.collectionId,
            collectionArtist: metadata.collectionArtist,
            collectionSymbol: metadata.collectionSymbol
          }
          listedItems.push(item)
        }
      }
      setLoading(false)
      setListedItems(listedItems)
    }

    const sellItem = async (item, price) => {
      await (await state.marketContract.sellItem(item.itemId, price)).wait();
      loadListedItems();
    }

    useEffect(() => {
      (async function () {
        try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accountTS = accounts[0].toUpperCase();
      setAccount(accountTS);
      loadListedItems();
    } catch (error) {
      console.error(error);
    }})();}, [])
    if (loading) return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    )
    return (
      <div className="flex justify-center">
        {listedItems.length > 0 ?
          <div className="px-5 py-3 container">
            <Row xs={1} md={2} lg={4} className="g-4 py-3">
              {listedItems.map((item, idx) => (
                <Col key={idx} className="overflow-hidden">
                  <Card className="d-flex align-items-stretch img-thumbnail">
                    <Card.Img variant="top" src={item.image} className='images' />
                    <Card.Body>
                      <div>
                      Artist: {item.collectionArtist}<br></br>
                      Collection: {item.collectionSymbol}<br></br>
                      Mint Number: {item.tokenId.toNumber()}
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      {!item.sold 
                      ? <div>On sale : {ethers.utils.formatEther(item.totalPrice)} ETH </div>
                      : <div>
                          <Form.Control onChange={(e) => setPrice(e.target.value)} size="sm" required type="text" placeholder="Enter selling price" className='mt-2' />
                          <Button onClick={() => sellItem(item, price)} variant="primary" size="md" className="mt-2">
                            Sell
                          </Button>
                      </div>}
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          : (
            <main style={{ padding: "1rem 0" }}>
              <h2>No listed assets</h2>
            </main>
          )}
      </div>
    );
}

export default MyItems;