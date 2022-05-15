import { useState, useEffect } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import React from 'react';
import { ethers } from "ethers";

function ItemsByCollection({ state, account, collectionExplore, setCollectionExplore }) {

    const [loading, setLoading] = useState(true);
    const [listedItems, setListedItems] = useState([]);
    const loadListedItems = async () => {
        // Load all sold items that the user listed
        const itemCountTemp = await state.marketContract.itemCount();
        const itemCount = itemCountTemp.toNumber();
        let listedItems = [];
        let soldItems = [];
        for (let indx = 1; indx <= itemCount; indx++) {
          const i = await state.marketContract.items(indx);
          const contractAddr = i.nft;
          if (collectionExplore.address == contractAddr) {
            if (!i.sold) {
              const uri = i.uri;
              const response = await fetch(uri);
              const ownerTS = i.owner.toUpperCase();
              const metadata = await response.json();
              const totalPrice = await state.marketContract.getTotalPrice(i.itemId);
              // define listed item object
              let item = {
                totalPrice,
                price: i.price,
                sold: i.sold,
                itemId: i.itemId,
                tokenId: i.tokenId,
                owner: ownerTS,
                name: metadata.name,
                description: metadata.description,
                image: metadata.image,
                collectionAddr: contractAddr,
                collectionId: metadata.collectionId,
                collectionArtist: metadata.collectionArtist,
                collectionSymbol: metadata.collectionSymbol
              }
              listedItems.push(item);
            }
          }
        }
        setLoading(false);
        setListedItems(listedItems);
      }

      const buyMarketItem = async (item) => {
        await (await state.marketContract.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
        loadListedItems();
      }

      useEffect(() => {
        loadListedItems();
      }, [])
      if (loading) return (
        <main style={{ padding: "1rem 0" }}>
          <h2>Loading...</h2>
        </main>
      )
      return (
        <div className="flex justify-center">
          {listedItems.length > 0 ?
            <div className="px-5 py-3 container">
                <h2>Listed</h2>  
              <Row xs={1} md={2} lg={4} className="g-4 py-3">
                {listedItems.map((item, idx) => (
                  <Col key={idx} className="overflow-hidden">
                    <Card className="d-flex align-items-stretch img-thumbnail">
                    <Card.Img variant="top" src={item.image} className='images'/>
                      <Card.Body>
                        <div>
                        Artist: {item.collectionArtist}<br></br>
                        Collection: {item.collectionSymbol}<br></br>
                        Mint Number: {item.tokenId.toNumber()}
                        </div>
                      </Card.Body>
                      <Card.Footer>
                      {item.owner != account ? 
                    <div className='d-grid'>
                      <Button onClick={() => buyMarketItem(item)} variant="primary" size="md">
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button>
                    </div> :  <div>It's yours! <br></br>On sale : {ethers.utils.formatEther(item.totalPrice)} ETH</div>}
                  </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
            : (
              <div className="row">
                <div className="col-md-8 mx-auto text-center text-warning mt-5">
                  <h3 className=''>No listed NFTS</h3>
                </div>
            </div>
            )}
        </div>
      );
}

export default ItemsByCollection;