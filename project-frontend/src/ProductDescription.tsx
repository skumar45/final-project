import React, { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom'; 
import Footer from './Footer';
import MessageModal from './MessageModal';
import './tokens.css';
import './index.css';
import './app.css';

function ProductDescription() {
  const { id } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate(); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const product = location.state?.product;

  if (!product) {
    return <h2>Error: Product not found. <button onClick={() => navigate(-1)}>Go Back</button></h2>;
  }

  return (
    <div className="product-description-page">
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} className="product-image" />
      <p>Size: {product.size}</p>
      <p>Description: {product.description}</p>
      <p>Price: ${product.price || '5'}</p> 

      <button onClick={() => setIsModalOpen(true)} className="message-seller-button">
        Message Seller
      </button>

      <MessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />



      <div className="listed-by-card">
        <img src="./assets/profile.jpeg" alt="Seller Profile" className="profile-image" />
        <p>Listed by: John Doe</p>
        <p>Listed on: 2025-02-23</p>
      </div>
     
    </div>
  );
}

export default ProductDescription;

{/* Add:
    Back button
    Favorites button
    Categories 
*/}