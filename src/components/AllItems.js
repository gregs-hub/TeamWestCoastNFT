import { useState, useEffect } from 'react'
import { Row, Col, Card } from 'react-bootstrap';
import { ethers } from "ethers";
import React from 'react';
// function renderSoldItems(items) {
//     return (
//       <>
//         <h2>Sold</h2>
//         <Row xs={1} md={2} lg={4} className="g-4 py-3">
//           {items.map((item, idx) => (
//             <Col key={idx} className="overflow-hidden">
//               <Card>
//                 <Card.Img variant="top" src={item.image} />
//                 <Card.Footer>
//                   {/* For {ethers.utils.formatEther(item.totalPrice)} ETH - Recieved {ethers.utils.formatEther(item.price)} ETH */}
//                 </Card.Footer>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </>
//     )
//   }

const MyItems = ({ state, account }) => {
    const [loading, setLoading] = useState(true)
    const [listedItems, setListedItems] = useState([])
    const [soldItems, setSoldItems] = useState([])
    const loadListedItems = async () => {
      // Load all sold items that the user listed
      const itemCountTemp = await state.marketContract.itemCount();
      const itemCount = itemCountTemp.toNumber();
      let listedItems = []
      let soldItems = []
      for (let indx = 1; indx <= itemCount; indx++) {
        const i = await state.marketContract.items(indx);
        if (!i.sold) {
          const contractAddr = i.nft;
          const uri = i.uri;
          const response = await fetch(uri);
          const metadata = await response.json();
          const totalPrice = await state.marketContract.getTotalPrice(i.itemId)
          // define listed item object
          let item = {
            totalPrice,
            price: i.price,
            itemId: i.itemId,
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
          // Add listed item to sold items array if sold
          if (i.sold) soldItems.push(item)
        }
      }
      setLoading(false)
      setListedItems(listedItems)
      setSoldItems(soldItems)
    }
    useEffect(() => {
      loadListedItems()
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
                  <Card>
                    <Card.Img variant="top" src={item.image} />
                    <Card.Body>
                      <div>
                      Artist: {item.collectionArtist}<br></br>
                      Collection: {item.collectionSymbol}<br></br>
                      Mint Number: {item.tokenId.toNumber()}
                      </div>
                    </Card.Body>
                    <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
              {/* {soldItems.length > 0 && renderSoldItems(soldItems)} */}
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