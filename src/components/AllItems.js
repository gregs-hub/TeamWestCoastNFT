import { useState, useEffect } from 'react'
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { ethers } from "ethers";
import React from 'react';

const AllItems = ({ state, account }) => {
    const [loading, setLoading] = useState(true)
    const [listedItems, setListedItems] = useState([])
    const [price, setPrice] = useState(null)

    const loadListedItems = async () => {
      // Load all sold items that the user listed
      const itemCountTemp = await state.marketContract.itemCount();
      const itemCount = itemCountTemp.toNumber();
      console.log(itemCount)
      let listedItems = []
      let soldItems = []
      for (let indx = 1; indx <= itemCount; indx++) {
        const i = await state.marketContract.items(indx);
        if (!i.sold) {
          const contractAddr = i.nft;
          const uri = i.uri;
          const ownerTS = i.owner.toUpperCase();
          const response = await fetch(uri);
          const metadata = await response.json();
          const totalPrice = await state.marketContract.getTotalPrice(i.itemId)
          // define listed item object
          console.log(ownerTS)
          console.log(account)
          console.log(i.owner)
          let item = {
            totalPrice,
            price: i.price,
            itemId: i.itemId,
            tokenId: i.tokenId,
            owner: ownerTS,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            isSFT: i.isSFT,
            amount: metadata.amount,
            collectionAddr: contractAddr,
            collectionId: metadata.collectionId,
            collectionArtist: metadata.collectionArtist,
            collectionSymbol: metadata.collectionSymbol
          }
          listedItems.push(item)
          // Add listed item to sold items array if sold
          if (i.sold) soldItems.push(item)
        }
      }
          setLoading(false)
          setListedItems(listedItems)
      }

    useEffect(() => {
      loadListedItems()
    }, [])

    const buyMarketItem = async (item) => {
      await (await state.marketContract.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
      loadListedItems()
    }

    const changePrice = async (item, price) => {
      await (await state.marketContract.changePrice(item.itemId, price)).wait()
      loadListedItems()
    }

    const removeFromMarket = async (item) => {
      await (await state.marketContract.removeFromMarketplace(item.itemId)).wait()
      loadListedItems()
    }

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
                    <Card.Img variant="top" src={item.image} className='images'/>
                    <Card.Body>
                      <div>
                      Artist: {item.collectionArtist}<br></br>
                      Collection: {item.collectionSymbol}<br></br>
                      Mint Number: {item.tokenId.toNumber()}
                      </div>
                      {item.isSFT 
                      ? <div>Amount: {item.amount}</div> 
                      : <div></div> }
                    </Card.Body>
                    <Card.Footer>
                      {item.owner != account ? 
                    <div className='d-grid'> 
                      {item.isSFT 
                      ? <Button onClick={() => buyMarketItem(item)} variant="primary" size="md">
                            Buy 1 for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button> 
                      : <Button onClick={() => buyMarketItem(item)} variant="primary" size="md">
                            Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                        </Button>}
                    </div> :  
                    <div className='d-grid'>
                      It's yours! Price: {ethers.utils.formatEther(item.totalPrice)} ETH
                      <Form.Control onChange={(e) => setPrice(e.target.value)} size="sm" required type="text" placeholder="Enter new price" className='mt-2' />
                      <Button onClick={() => changePrice(item, price)} variant="primary" size="md" className="mb-1 mt-2">
                        Change Price
                      </Button>
                      <Button onClick={() => removeFromMarket(item)} variant="primary" size="md" className='mb-2'>
                        Remove
                      </Button>
                    </div>}
                  </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
              {/* {soldItems.length > 0 && renderSoldItems(soldItems)} */}
          </div>
          : (
            <div className="row coiny">
              <div className="col-md-8 mx-auto text-center text-warning mt-5">
                <h3 className=''>No listed NFTS!</h3>
              </div>
            </div>
          )}
      </div>
    );
}

export default AllItems;