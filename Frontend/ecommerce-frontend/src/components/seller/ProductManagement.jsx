import React, { useEffect, useState } from 'react';
import {
  getMyProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
} from '../../services/productService';
import axios from 'axios';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ productName: '', description: '', price: '', stock: '', category: '' });
  const [selectedProductId, setSelectedProductId] = useState(null);
  // const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchMyProducts();
    fetchCategories();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const res = await getMyProducts();
      setProducts(res);
    } catch (err) {
      console.error("❌ Failed to fetch products", err);
      alert("Failed to fetch products");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://localhost:7203/api/Category");
      setCategories(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch categories", err);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const productPayload = {
        productId: selectedProductId,
        name: form.productName,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        categoryId: parseInt(form.category),
      };

      console.log("📤 Payload to backend:", productPayload);

      if (selectedProductId) {
        await updateProduct(selectedProductId, productPayload);
        alert("✅ Product updated");
      } else {
        await addProduct(productPayload);
        alert("✅ Product added");
      }

      resetForm();
      fetchMyProducts();
    } catch (err) {
      console.error("❌ Error in add/update", err);
      alert("Failed to add/update product");
    }
  };

  const handleEdit = (product) => {
    setForm({
      productName: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.categoryId?.toString() || '',
    });
    setSelectedProductId(product.productId);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      alert("✅ Product deleted");
      fetchMyProducts();
    } catch (err) {
      console.error("❌ Delete failed", err);
      alert("Delete failed");
    }
  };

 const handleImageUpload = async (productId, file) => {
  if (!file) return alert("Please select an image file");
  try {
    await uploadProductImage(productId, file);
    alert("✅ Image uploaded");
    fetchMyProducts(); // refresh list
  } catch (err) {
    console.error("❌ Image upload failed", err);
    alert("Image upload failed");
  }
};

  const resetForm = () => {
    setForm({ productName: '', description: '', price: '', stock: '', category: '' });
    setSelectedProductId(null);
  };

  return (
    <div className="container mt-4">
      <h2>🛒 My Products</h2>

      <form className="mb-4" onSubmit={handleAddOrUpdate}>
        <div className="row g-2">
          <div className="col-md-4">
            <input name="productName" value={form.productName || ''} onChange={handleInputChange} className="form-control" placeholder="Product Name" required />
          </div>
          <div className="col-md-4">
            <input name="price" type="number" value={form.price || ''} onChange={handleInputChange} className="form-control" placeholder="Price" required />
          </div>
          <div className="col-md-4">
            <input name="stock" type="number" value={form.stock || ''} onChange={handleInputChange} className="form-control" placeholder="Stock" required />
          </div>
          <div className="col-md-6">
            <select name="category" value={form.category} onChange={handleInputChange} className="form-control" required>
              <option value="">-- Select Category --</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId.toString()}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <textarea name="description" value={form.description || ''} onChange={handleInputChange} className="form-control" placeholder="Description" rows="1" required />
          </div>
          <div className="col-md-12">
            <button className="btn btn-success" type="submit">{selectedProductId ? "Update" : "Add"} Product</button>
            {selectedProductId && (
              <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </div>
      </form>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Image</th>
            <th>Upload Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod.productId}>
              <td>{prod.name}</td>
              <td>₹{prod.price}</td>
              <td>{prod.stock}</td>
              <td>{prod.category?.name || "Unknown"}</td>
              <td>
                {prod.imagePath && prod.imagePath !== "" && prod.imagePath !== null ? (
                  <img
                    src={`https://localhost:7203/Images/Products/${prod.imagePath}`}
                    alt="Product"
                    width="50"
                    height="50"
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-placeholder.png"; // Optional fallback
                    }}
                  />
                ) : (
                  <span>No image</span>
                )}
              </td>
              <td>
               <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={(e) => handleImageUpload(prod.productId, e.target.files[0])}
                />
                </td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(prod)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(prod.productId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
