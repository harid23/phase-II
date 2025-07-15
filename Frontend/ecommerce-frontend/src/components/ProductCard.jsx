import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  onPlaceOrder
}) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const imageUrl = 
    product.imagePath && product.imagePath.toLowerCase() !== "string"
      ? `https://localhost:7203/Images/Products/${product.imagePath}`
      : "/default-placeholder.png";

  return (
    <div className="card product-card h-100 shadow-sm border-0">
      <img
        src={imageUrl}
        className="card-img-top product-image"
        alt={product.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/default-placeholder.png";
        }}
      />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text fw-bold text-success">₹{product.price}</p>
        <p className="text-muted small">Category: {product.category?.name || 'N/A'}</p>

        {/* Always visible */}
        <button
          className="btn btn-sm btn-outline-info mb-2"
          onClick={() => navigate(`/product/${product.productId}`)}
        >
          View Details
        </button>

        {/* Only for Customers */}
        {role?.toLowerCase() === "customer" && (
          <>
            <div className="input-group mb-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                type="button"
                onClick={() => onQuantityChange(product.productId, Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input
                type="text"
                className="form-control text-center"
                style={{ maxWidth: '50px' }}
                value={quantity}
                readOnly
              />
              <button
                className="btn btn-outline-secondary btn-sm"
                type="button"
                onClick={() => onQuantityChange(product.productId, quantity + 1)}
              >
                +
              </button>
            </div>

            <div className="card-actions d-flex flex-column gap-2">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => onAddToCart(product)}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-sm btn-success"
                onClick={() => onPlaceOrder(product)}
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
