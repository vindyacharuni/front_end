import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import UploadMedia from "../../utils/UploadMedia";// Ensure this path is correct
import "./AddProduct.css";

export default function AddProduct() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState([""]);
  const [labelledPrice, setLabelledPrice] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [category, setCategory] = useState("");
  
  // New state to hold the actual File objects
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAltNameChange = (index, value) => {
    const next = [...altNames];
    next[index] = value;
    setAltNames(next);
  };

  const addAltName = () => setAltNames((s) => [...s, ""]);
  const removeAltName = (index) => setAltNames((s) => s.filter((_, i) => i !== index));

  // Handle file selection from the input
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const resetForm = () => {
    setProductId("");
    setName("");
    setAltNames([""]);
    setLabelledPrice("");
    setPrice("");
    setImageFiles([]); // Reset files
    setDescription("");
    setStock(0);
    setIsAvailable(true);
    setCategory("cosmetics");
    
    // Clear the file input visually
    const fileInput = document.getElementById("product-images");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to add a product.");
      return;
    }

    setLoading(true);
    
    try {
      // 1. Upload all selected files to Supabase first
      const uploadedUrls = [];
      if (imageFiles.length > 0) {
        // Uploading sequentially to prevent toast notification spam
        for (const file of imageFiles) {
          const url = await UploadMedia(file);
          if (url) uploadedUrls.push(url);
        }
      }

      // 2. Prepare the payload with the newly generated URLs
      const payload = {
        productId: String(productId),
        name: String(name),
        altNames: altNames.filter((s) => s && s.trim() !== ""),
        labelledPrice: Number(labelledPrice),
        price: Number(price),
        images: uploadedUrls.length ? uploadedUrls : ["/default-product.jpg"], // Fallback if no images
        description: String(description),
        stock: Number(stock),
        isAvailable: Boolean(isAvailable),
        category: String(category) || "",
      };

      // 3. Save to your database
      await axios.put(`http://localhost:5000/api/products/${productId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success("Product created successfully");
      resetForm();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to create product";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-card">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit} className="add-product-form">
          <label>
            Product ID*:
            <input value={productId} onChange={(e) => setProductId(e.target.value)} required />
          </label>

          <label>
            Name*:
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <fieldset>
            <legend>Alternative Names</legend>
            {altNames.map((alt, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input value={alt} onChange={(e) => handleAltNameChange(i, e.target.value)} />
                <button type="button" onClick={() => removeAltName(i)} disabled={altNames.length === 1}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addAltName}>Add alt name</button>
          </fieldset>

          <label>
            Labelled Price*:
            <input type="number" value={labelledPrice} onChange={(e) => setLabelledPrice(e.target.value)} required />
          </label>

          <label>
            Price*:
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </label>

          <fieldset>
            <legend>Images</legend>
            {/* Replaced manual URL text inputs with a multiple file uploader */}
            <input 
              id="product-images"
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            {imageFiles.length > 0 && (
              <div style={{ marginTop: "10px", fontSize: "0.9em", color: "#555" }}>
                <strong>Selected Files:</strong>
                <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
                  {imageFiles.map((file, i) => (
                    <li key={i}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </fieldset>

          <label>
            Description*:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </label>

          <label>
            Stock*:
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
          </label>

          <label>
            Available:
            <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
          </label>

          <label>
            Category*:
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="cosmetics">Cosmetics</option>
              <option value="skincare">Skincare</option>
              <option value="haircare">Haircare</option>
            </select>
          </label>
          
          <div className="form-actions">
            <Link to="/admin" className="btn-muted muted-link">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-gradient">
              {loading ? "Uploading & Saving..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}