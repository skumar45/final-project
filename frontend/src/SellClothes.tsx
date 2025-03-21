import React, { useState } from 'react';
import Footer from './Footer';
import './tokens.css';
import './index.css';
import './app.css';
import { Spinner } from "./Spinner"; 

interface Product {
  id: number;
  name: string;
  image: string;
  size: string;
  price: number;
  brand: string;
  description: string;
}

interface FormData {
  name: string;
  photos: string[];
  price: string;
  size: string;
  brand: string;
  description: string;
}

function SellClothes() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    photos: [],
    price: "",
    size: "",
    brand: "",
    description: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]); 

  const updateForm = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); 

    const newPhotos: string[] = Array.from(files).map((file) => URL.createObjectURL(file));
    setUploadedPhotos((prev) => [...prev, ...newPhotos]); 

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos] 
    }));

    setIsLoading(false);
  };

  const handleConfirmListing = () => {
    if (!formData.name.trim() || !formData.price) {
      alert("Please fill in required fields");
      return;
    }

    const newProduct: Product = {
      id: Date.now(),  
      name: formData.name.trim(),
      image: formData.photos.length > 0 ? formData.photos[0] : "https://via.placeholder.com/150",
      size: formData.size || "N/A",
      price: Number(formData.price),
      brand: formData.brand || "Unknown",
      description: formData.description,
    };

    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]") as Product[];
    const updatedProducts = [...storedProducts, newProduct];

    localStorage.setItem("products", JSON.stringify(updatedProducts));

    alert("Product added!");

    setFormData({
      name: "",
      photos: [],
      price: "",
      size: "",
      brand: "",
      description: ""
    });
    setUploadedPhotos([]);
  };

  return (
    <div className="sell-clothes-container">
      <h2>Sell Your Clothes</h2>
      <div className="photo-upload">
        <label htmlFor="product-photos">Upload Photos</label>
        <input type="file" id="product-photos" multiple onChange={handleFileChange} disabled={isLoading} />
        
        {isLoading ? <Spinner className="spinner" /> : <p>{uploadedPhotos.length} photos uploaded</p>}

        <div className="uploaded-photos">
          {uploadedPhotos.length > 0
            ? uploadedPhotos.map((src, index) => (
                <img key={index} src={src} alt={`Uploaded ${index + 1}`} className="photo-preview" />
              ))
            : !isLoading && <img src="https://via.placeholder.com/150" alt="Placeholder" className="photo-preview" />
          }
        </div>
      </div>

      <label>Product Name:</label>
      <input type="text" value={formData.name} onChange={(e) => updateForm("name", e.target.value)} />

      <label>Price ($):</label>
      <input type="number" value={formData.price} onChange={(e) => updateForm("price", e.target.value)} />

      <label>Size:</label>
      <input type="text" value={formData.size} onChange={(e) => updateForm("size", e.target.value)} />

      <label>Brand:</label>
      <input type="text" value={formData.brand} onChange={(e) => updateForm("brand", e.target.value)} />

      <label>Description:</label>
      <textarea value={formData.description} onChange={(e) => updateForm("description", e.target.value)} />

      <button onClick={handleConfirmListing} className="confirm-listing-button">
        Confirm Listing
      </button>
    </div>
  );
}

export default SellClothes;