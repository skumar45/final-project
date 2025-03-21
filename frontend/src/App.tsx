import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Buy from './Listings';
import SellClothes from './SellClothes';
import ProductDescription from './ProductDescription';
import Header from './Header';
import Footer from './Footer';
import Login from './Login';
import { API_URL } from './config';  

import sequintop from './assets/sequintop.jpeg';
import baggyjeans from './assets/baggyjeans.jpeg';
import coachpurse from './assets/coachpurse.jpeg';
import hoodie from './assets/hoodie.jpeg';

interface Product {
  id: number;
  name: string;
  image: string;
  size: string;
  price: number;
  brand: string;
  description: string;
}

const initialProducts = [
  { id: 1, name: 'Vintage Sequin Top', image: sequintop, size: 'M', description: 'Brand new sequin top with tags', price: 25, brand: "Vintage" },
  { id: 2, name: 'Stylish Jeans', image: baggyjeans, size: 'S', description: 'Baggy jeans with a modern look, worn once', price: 20, brand: "Denim Co." },
  { id: 3, name: 'Coach Purse', image: coachpurse, size: 'OS', description: 'Vintage coach purse', price: 50, brand: "Coach" },
  { id: 4, name: 'White Fox Hoodie', image: hoodie, size: 'L', description: 'Black hoodie with small stain', price: 30, brand: "White Fox" },
];

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(sessionStorage.getItem("token"));

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "enabled";
    setIsDarkMode(savedMode);
    
    if (savedMode) {
      document.body.classList.add("dark-mode");
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    }
  }, [isDarkMode]);

  return (
    <Router>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <Routes>
        <Route path="/buy" element={<Buy />} /> 
        <Route path="/sell" element={<SellClothes />} />
        <Route path="/product/:id" element={<ProductDescription />} /> 
        <Route path="/login" element={<Login setToken={setToken} />} />  
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;