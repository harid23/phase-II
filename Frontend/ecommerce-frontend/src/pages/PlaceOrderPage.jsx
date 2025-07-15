import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { placeOrder } from '../services/orderService';
import { getProductById } from '../services/productService';

export default function PlaceOrderPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error("❌ Failed to fetch product", err);
        alert("Product not found");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

const handlePlaceOrder = async () => {
  if (!quantity || quantity < 1) {
    alert("Enter a valid quantity.");
    return;
  }

  if (quantity > product.stock) {
    alert(`Only ${product.stock} items available.`);
    return;
  }

  if (!shippingAddress.trim()) {
    alert("Please enter a shipping address.");
    return;
  }

  const customerId = parseInt(localStorage.getItem("customerId"));
  if (!customerId || isNaN(customerId)) {
    alert("Invalid or missing customer ID. Please log in again.");
    navigate("/login");
    return;
  }

  try {
    const order = {
      customerId: customerId,
      productId: parseInt(productId),
      quantity: parseInt(quantity),
      shippingAddress
    };

    console.log("📦 Sending order data:", order);

    const response = await placeOrder(order); 
    const orderId = response;
    if (!orderId) {
      alert("❌ Order ID not returned by API.");
      return;
    }

    alert(`✅ Order placed for "${product.name}". Proceeding to payment...`);
    navigate(`/make-payment/${orderId}`);
  } catch (err) {
    console.error("❌ Failed to place order", err);
    alert(err.response?.data?.message || "❌ Failed to place order.");
  }
};



  if (loading) return <p className="text-center">Loading product...</p>;
if (!product) return <p className="text-center text-danger">❌ Product not found.</p>;
  return (
    <div className="container mt-5">
      <h2>Place Order</h2>
      <hr />
      {product && (
        <div className="card p-4">
          <h4>{product.name}</h4>
          <p>{product.description}</p>
          <p><strong>Price per Unit:</strong> ₹{product.price}</p>
          <p><strong>Available stock:</strong> {product.stock}</p>
          <p><strong>Total Price:</strong> ₹{quantity * product.price}</p>

          <div className="mb-3">
            <label>Quantity:</label>
            <input
              type="number"
              className="form-control"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
               style={{ color: '#000' }} 
            />
          </div>

          <div className="mb-3">
            <label>Shipping Address:</label>
            <textarea
              className="form-control"
              rows="3"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
               style={{ color: '#000' }} 
            />
          </div>

          <button className="btn btn-success" onClick={handlePlaceOrder}>
            Confirm Order
          </button>
        </div>
      )}
    </div>
  );
}
