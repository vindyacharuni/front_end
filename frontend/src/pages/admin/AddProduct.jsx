import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./AddProduct.css";

export default function AddProduct() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState([""]);
  const [labelledPrice, setLabelledPrice] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState(["/default-product.jpg"]);
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [category, setCategory] = useState("cosmetics");
  const [loading, setLoading] = useState(false);

  const handleAltNameChange = (index, value) => {
    const next = [...altNames];
    next[index] = value;
    setAltNames(next);
  };

  const addAltName = () => setAltNames((s) => [...s, ""]);
  const removeAltName = (index) => setAltNames((s) => s.filter((_, i) => i !== index));

  const handleImageChange = (index, value) => {
    const next = [...images];
    next[index] = value;
    setImages(next);
  };
  const addImage = () => setImages((s) => [...s, ""]);
  const removeImage = (index) => setImages((s) => s.filter((_, i) => i !== index));

  const resetForm = () => {
    setProductId("");
    setName("");
    setAltNames([""]);
    setLabelledPrice("");
    setPrice("");
    setImages(["/default-product.jpg"]);
    setDescription("");
    setStock(0);
    setIsAvailable(true);
    setCategory("cosmetics");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        productId: String(productId),
        name: String(name),
        altNames: altNames.filter((s) => s && s.trim() !== ""),
        labelledPrice: Number(labelledPrice),
        price: Number(price),
        images: images.length ? images.filter((s) => s && s.trim() !== "") : ["/default-product.jpg"],
        description: String(description),
        stock: Number(stock),
        isAvailable: Boolean(isAvailable),
        category: String(category) || "cosmetics",
      };
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to add a product.");
        return;
      }

      await axios.post("http://localhost:5000/api/products", payload, {
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
          {images.map((img, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input value={img} onChange={(e) => handleImageChange(i, e.target.value)} />
              <button type="button" onClick={() => removeImage(i)} disabled={images.length === 1}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addImage}>Add image</button>
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
          <input value={category} onChange={(e) => setCategory(e.target.value)} required />
        </label>
        <div className="form-actions">
          <button type="button" onClick={resetForm} className="btn-muted">Reset</button>
          <Link to="/admin/AdminHomePage" className="btn-muted muted-link">View Products</Link>
          <button type="submit" disabled={loading} className="btn-gradient">{loading ? "Saving..." : "Add Product"}</button>
        </div>
        </form>
      </div>
    </div>
  );
}
