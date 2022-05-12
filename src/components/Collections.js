import { useState, useEffect } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import React from 'react';

const Collections = ({ state }) => {

    const [collections, setCollections] = useState([])
    const loadMarketplaceCollections = async () => {
      const collectionCount = await state.marketContract.collectionCount();
      const mycollec = await state.marketContract.collections(1);
      console.log(mycollec.owner);
      let collections = [];
    //   const collection = await state.marketContract.collections(1).call();
    //     console.log(collection);

    //     state.marketContract.on("Collections", (collectionId, owner, collectionAddress) => {
    //       console.log(collectionId, owner, collectionAddress);
    //   });


      for (let i = 1; i <= collectionCount; i++) {
        // const listCollection = await state.marketContract.getPastEvents 
        
        // const collectionAddr = collection(2);
        // console.log(collectionAddr)
    //     const uri = await collection.tokenURI(collection.collectionId);
    //     const response = await fetch(uri);
    //     const metadata = await response.json();
    //     collections.push({
    //         collectionId: collection.itemId,
    //         artistName: metadata.artistName,
    //         artistSymbol: metadata.artistSymbol,
    //         image: metadata.image
    //     })
       }
    //   setCollections(collections);
    }
  
    const goToCollection = async (item) => {
    //   await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    //   loadMarketplaceItems()
    }
  
    useEffect(() => {
      loadMarketplaceCollections();
    }, [])

    return (
      <div className="flex justify-center">
        {collections.length > 0 ?
          <div className="px-5 container">
              <div>
                  <h1>ONGLET FILTER</h1>
                </div>
            <Row xs={1} md={2} lg={4} className="g-4 py-5">
              {collections.map((collection, idx) => (
                <Col key={idx} className="overflow-hidden">
                  <Card>
                    <Card.Img variant="top" src={collection.image} />
                    <Card.Body color="secondary">
                      <Card.Title>{collection.artistName}</Card.Title>
                      <Card.Text>
                        {collection.artistSymbol}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <div className='d-grid'>
                        <Button onClick={() => goToCollection(collection)} variant="primary" size="lg">
                          Explore
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          : (
            <main style={{ padding: "1rem 0" }}>
              <h2>No listed collections</h2>
            </main>
          )}
      </div>
    );
  }

export default Collections;