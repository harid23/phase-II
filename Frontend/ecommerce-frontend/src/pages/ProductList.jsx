import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../services/productService';
import { addToCart } from '../services/cartService';
import { placeOrder } from '../services/orderService';
import { getAllCategories } from '../services/categoryService';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [quantities, setQuantities] = useState({});
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
      setFiltered(data);
    } catch (err) {
      console.error("❌ Failed to fetch products", err);
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

  const handleFilter = () => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter(p =>
        (p.name || '').toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.trim()) {
      result = result.filter(p =>
        (p.category?.name || '').toLowerCase() === category.toLowerCase()
      );
    }

    if (minPrice !== '' && maxPrice !== '') {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);

      if (isNaN(min) || isNaN(max)) {
        alert("Please enter valid price range.");
        return;
      }

      if (min < 10 || max <= min) {
        alert("Min should be ≥ ₹10 and Max should be > Min.");
        return;
      }

      result = result.filter(p => p.price >= min && p.price <= max);
    }

    setFiltered(result);
  };

  const handleQuantityChange = (productId, qty) => {
    const parsedQty = parseInt(qty);
    setQuantities({ ...quantities, [productId]: parsedQty > 0 ? parsedQty : 1 });
  };

 const handleAddToCart = async (product) => {
  if (!token) {
    alert("Please login to add items to cart.");
    return navigate("/login");
  }

  if (role?.toLowerCase() !== "customer") {
    alert("Only customers can add to cart.");
    return;
  }

  const quantity = quantities[product.productId] || 1;

  try {
    await addToCart(product.productId, quantity, token);
    alert(`✅ "${product.name}" added to cart.`);
  } catch (err) {
    console.error("❌ Add to cart failed:", err.response?.data || err.message);
    alert("❌ Failed to add to cart.");
  }
};

const handlePlaceOrder = (product) => {
  if (!token) {
    alert("Please login to place orders.");
    return navigate("/login");
  }

  if (role?.toLowerCase() !== "customer") {
    alert("Only customers can place orders.");
    return;
  }

  navigate(`/place-order/${product.productId}`);
};

  return (
    <div className="product-list-wrapper">
    <div className="container mt-4">
      <h2>🛍️ Available Products</h2>

      {/* Filter Section */}
      <div className="row mb-4">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.categoryId} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
          />
        </div>

        <div className="col-md-1">
          <button className="btn btn-primary w-100" onClick={handleFilter}>Filter</button>
        </div>
        <div className="col-md-1">
          <button className="btn btn-secondary w-100" onClick={fetchProducts}>Reset</button>
        </div>
      </div>

      {/* Product Cards */}
      <div className="row">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={product.productId}>
              <ProductCard
                product={product}
                quantity={quantities[product.productId] || 1}
                onQuantityChange={handleQuantityChange}
                onAddToCart={handleAddToCart}
                onPlaceOrder={handlePlaceOrder}
                showActions={role === "customer"}
              />
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
    </div>

  );
}
