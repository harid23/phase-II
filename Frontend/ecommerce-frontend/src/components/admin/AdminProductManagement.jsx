import React, { useEffect, useState } from 'react';
import { getAllProducts, deleteProduct, uploadProductImage } from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';
import { getAllSellers } from '../../services/sellerService';
import ProductForm from '../../components/products/ProductForm';
import ProductTable from '../../components/products/ProductTable';

export default function AdminProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({ sellerId: '', categoryId: '' });
  const [stockThreshold, setStockThreshold] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSellers();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("❌ Failed to fetch all products", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("❌ Failed to fetch categories", err);
    }
  };

  const fetchSellers = async () => {
    try {
      const data = await getAllSellers();
      setSellers(data);
    } catch (err) {
      console.error("❌ Failed to fetch sellers", err);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error("❌ Delete failed", err);
    }
  };

  const handleImageUpload = async (productId, file) => {
    if (!file) return;
    try {
      await uploadProductImage(productId, file);
      fetchProducts();
    } catch (err) {
      console.error("❌ Image upload failed", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = !filters.categoryId || p.category?.categoryId === parseInt(filters.categoryId);
    const matchesSeller = !filters.sellerId || p.sellerId === filters.sellerId;
    const matchesStock = !stockThreshold || p.stock < parseInt(stockThreshold);
    return matchesCategory && matchesSeller && matchesStock;
  });

  return (
    <div className="container mt-4">
      <h2>📦 Admin Product Management</h2>

      <div className="row mb-3">
        <div className="col-md-4">
          <div className="card text-center bg-primary text-white">
            <div className="card-body py-2">
              <h6 className="fw-bold mb-1">📊 Total Products</h6>
              <h5>{products.length}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-light border-success">
            <div className="card-body py-2">
              <h6 className="fw-bold text-success mb-1">✅ Filtered Products</h6>
              <h5 className="text-success">{filteredProducts.length}</h5>
            </div>
          </div>
        </div>
        {(filters.categoryId || filters.sellerId || stockThreshold) && (
          <div className="col-md-4">
            <div className="card text-center bg-warning">
              <div className="card-body py-2">
                <h6 className="fw-bold text-dark mb-1">🔍 Current Filter</h6>
                <small className="text-dark">
                  {filters.categoryId && `Category ID: ${filters.categoryId} `}
                  {filters.sellerId && `| Seller ID: ${filters.sellerId} `}
                  {stockThreshold && `| Stock < ${stockThreshold}`}
                </small>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Filter by Category:</label>
          <select
            className="form-select"
            name="categoryId"
            value={filters.categoryId}
            onChange={handleFilterChange}
          >
            <option value=''>-- All Categories --</option>
            {categories.map(cat => (
              <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Filter by Seller:</label>
          <select
            className="form-select"
            name="sellerId"
            value={filters.sellerId}
            onChange={handleFilterChange}
          >
            <option value=''>-- All Sellers --</option>
            {sellers.map(sel => (
              <option key={sel.sellerId} value={sel.sellerId}>{sel.sellerName}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Filter by Stock Less Than:</label>
          <input
            type="number"
            className="form-control"
            placeholder="e.g. 10"
            value={stockThreshold}
            onChange={(e) => setStockThreshold(e.target.value)}
          />
        </div>
      </div>

      <ProductForm
        categories={categories}
        sellers={sellers}
        existingProduct={selectedProduct}
        onSuccess={() => {
          fetchProducts();
          setSelectedProduct(null);
        }}
        isUpdateMode={!!selectedProduct}
        isAdminView={true}
      />
      <ProductTable
        products={filteredProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onImageUpload={handleImageUpload}
        highlightLowStock={true} 
      />
    </div>
  );
}
