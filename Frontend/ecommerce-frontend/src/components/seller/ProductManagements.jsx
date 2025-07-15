import React, { useEffect, useState } from 'react';
import {
  getMyProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
} from '../../services/productService';
import axios from 'axios';
import ProductForm from '../../components/products/ProductForm';
import ProductTable from '../../components/products/ProductTable';

export default function ProductManagements() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ productName: '', description: '', price: '', stock: '', category: '' });
  const [selectedProductId, setSelectedProductId] = useState(null);

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
      const payload = {
        productId: selectedProductId,
        name: form.productName,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        categoryId: parseInt(form.category)
      };

      if (selectedProductId) {
        await updateProduct(selectedProductId, payload);
        alert("✅ Product updated");
      } else {
        await addProduct(payload);
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
      category: product.categoryId?.toString() || ''
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
      fetchMyProducts();
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
      <ProductForm
        formData={form}
        categories={categories}
        onChange={handleInputChange}
        onSubmit={handleAddOrUpdate}
        onCancel={resetForm}
        isUpdateMode={!!selectedProductId}
      />
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUploadImage={handleImageUpload}
      />
    </div>
  );
}
