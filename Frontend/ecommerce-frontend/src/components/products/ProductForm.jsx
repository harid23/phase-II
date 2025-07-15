import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct } from '../../services/productService';

export default function ProductForm({
  formData,
  categories,
  sellers = [],
  existingProduct,
  onChange,
  onSubmit,
  onCancel,
  isUpdateMode,
  onSuccess,
  isAdminView = false
}) {
  const [localForm, setLocalForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    categoryId: '',
    sellerId: ''
  });

  useEffect(() => {
    if (existingProduct) {
      setLocalForm({
        name: existingProduct.name || '',
        price: existingProduct.price || '',
        stock: existingProduct.stock || '',
        description: existingProduct.description || '',
        categoryId: existingProduct.categoryId?.toString() || '',
        sellerId: existingProduct.sellerId || ''
      });
    } else {
      setLocalForm({
        name: '',
        price: '',
        stock: '',
        description: '',
        categoryId: '',
        sellerId: ''
      });
    }
  }, [existingProduct]);

  const handleChange = (e) => {
    setLocalForm({ ...localForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(localForm.price) || isNaN(localForm.stock)) {
      alert("❌ Price and Stock must be numbers.");
      return;
    }

    const productData = {
      name: localForm.name.trim(),
      description: localForm.description.trim(),
      price: parseFloat(localForm.price),
      stock: parseInt(localForm.stock),
      categoryId: parseInt(localForm.categoryId),
    };

    if (isAdminView && localForm.sellerId) {
      productData.sellerId = parseInt(localForm.sellerId); 
    }

    try {
      console.log("✅ Submitting →", productData);

      if (isUpdateMode && existingProduct) {
        await updateProduct(existingProduct.productId, {
          ...productData,
          productId: existingProduct.productId,
        });
      } else {
        await addProduct(productData);
      }

      if (onSuccess) onSuccess();

      setLocalForm({
        name: '',
        price: '',
        stock: '',
        description: '',
        categoryId: '',
        sellerId: ''
      });
    } catch (err) {
      console.error("❌ Submit failed", err.response?.data || err.message);
      alert(`Submit failed: ${err.response?.data || err.message}`);
    }
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <div className="row g-2">
        <div className="col-md-4">
          <input
            name="name"
            value={localForm.name}
            onChange={handleChange}
            className="form-control"
            placeholder="Product Name"
            required
          />
        </div>
        <div className="col-md-4">
          <input
            name="price"
            type="number"
            value={localForm.price}
            onChange={handleChange}
            className="form-control"
            placeholder="Price (₹)"
            required
          />
        </div>
        <div className="col-md-4">
          <input
            name="stock"
            type="number"
            value={localForm.stock}
            onChange={handleChange}
            className="form-control"
            placeholder="Stock"
            required
          />
        </div>
        <div className="col-md-6">
          <select
            name="categoryId"
            value={localForm.categoryId}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {isAdminView && (
          <div className="col-md-6">
            <select
              name="sellerId"
              value={localForm.sellerId}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">-- Select Seller --</option>
              {sellers.map((sel) => (
                <option key={sel.userId} value={sel.userId}>
                  {sel.sellerName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="col-md-12">
          <textarea
            name="description"
            value={localForm.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Description"
            rows="2"
            required
          />
        </div>

        <div className="col-md-12">
          <button className="btn btn-success" type="submit">
            {isUpdateMode ? 'Update' : 'Add'} Product
          </button>
          {isUpdateMode && (
            <button type="button" className="btn btn-secondary ms-2" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
