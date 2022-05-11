import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'

const Collections = ({nft, marketplace, account}) => {
    const [loading, setLoading] = useState(true)
    const [collections, setCollections] = useState([])

    const loadMarketplaceCollections = async () => {

      const collectionCount = await marketplace.collectionCount()
      let collections = [];
      for (let i = 1; i <= collectionCount; i++) {
        const collection = await marketplace.collections(i)
        // get uri url from nft contract
        const uri = await collection.tokenURI(collection.collectionId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // Add item to items array
        collections.push({
            collectionId: collection.itemId,
            artistName: metadata.artistName,
            artistSymbol: metadata.artistSymbol,
            image: metadata.image
        })
      }
      setLoading(false)
      setCollections(collections)
    }
  
    const goToCollection = async (item) => {
    //   await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    //   loadMarketplaceItems()
    }
  
    useEffect(() => {
      loadMarketplaceCollections()
    }, [])
    if (loading) return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    )
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