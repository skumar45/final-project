import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import Footer from './Footer';
import './tokens.css';
import './index.css';
import './app.css';

interface Product {
  id: number;
  name: string;
  image: string;
  size: string;
  price: number;
  brand: string;
  description: string;
}

const initialProducts: Product[] = [
  { id: 1, name: 'Vintage Sequin Top', image: "https://via.placeholder.com/150", size: 'M', price: 25, brand: "Vintage", description: 'Brand new sequin top with tags' },
  { id: 2, name: 'Stylish Jeans', image: "https://via.placeholder.com/150", size: 'S', price: 20, brand: "Denim Co.", description: 'Baggy jeans with a modern look, worn once' },
  { id: 3, name: 'Coach Purse', image: "https://via.placeholder.com/150", size: 'OS', price: 50, brand: "Coach", description: 'Vintage coach purse' },
  { id: 4, name: 'White Fox Hoodie', image: "https://via.placeholder.com/150", size: 'L', price: 30, brand: "White Fox", description: 'Black hoodie with small stain' },
];

function Buy() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]") as Product[];

    if (storedProducts.length === 0) {
      localStorage.setItem("products", JSON.stringify(initialProducts));
      setProducts(initialProducts);
    } else {
      setProducts(storedProducts);
    }
  }, []);

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="buy-page">
      <h1>Products</h1>
      <input 
        type="text" 
        placeholder="Search products..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="search-bar"
      />
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} state={{ product }} className="product-link">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>Size: {product.size}</p>
                <p>Price: ${product.price}</p>
                <p>Brand: {product.brand}</p>
                <p>{product.description}</p>
              </Link>
              <button onClick={() => deleteProduct(product.id)} className="delete-button">
                🗑️ Delete
              </button>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}

export default Buy;