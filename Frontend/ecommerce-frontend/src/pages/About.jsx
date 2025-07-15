import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById ,getReviewsByProductId} from '../services/productService';
import { addToCart } from '../services/cartService';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      console.error("❌ Failed to fetch product", err);
      alert("Product not found.");
      navigate("/");
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
      const newQty = prev + delta;
      return newQty < 1 ? 1 : newQty;
    });
  };

  const handleAddToCart = async () => {
    if (!token || role !== "customer") return navigate("/login");

    try {
      await addToCart(product.productId, quantity, token);
      alert("✅ Added to cart!");
    } catch (err) {
      alert("❌ Failed to add to cart");
      console.error(err);
    }
  };

  const handlePlaceOrder = () => {
    if (!token || role !== "customer") return navigate("/login");
    navigate(`/place-order/${product.productId}`);
  };
  const fetchReviews = async () => {
  try {
    const data = await getReviewsByProductId(id);
    setReviews(data);
  } catch (err) {
    console.error("❌ Failed to fetch reviews", err);
  }
};

  if (!product) return <p>Loading...</p>;

  const imageUrl = product.imagePath?.toLowerCase() !== "string"
    ? `https://localhost:7203/Images/Products/${product.imagePath}`
    : "/default-placeholder.png";

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Product Image */}
        <div className="col-md-5">
          <img src={imageUrl} alt={product.name} className="img-fluid rounded shadow" />
        </div>
        <div className="col-md-7">
          <h3>{product.name}</h3>
          <p className="text-muted">
            by {product.seller?.sellerName} ({product.seller?.companyName})
          </p>
          <h4 className="text-success">₹{product.price}</h4>
          <p>{product.description}</p>
          <p><strong>Stock:</strong> {product.stock}</p>

          <div className="d-flex align-items-center mb-3">
            <button className="btn btn-outline-secondary" onClick={() => handleQuantityChange(-1)}>-</button>
            <input
              type="number"
              className="form-control mx-2 text-center"
              style={{ width: '70px' ,color: '#000'}}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max={product.stock}
            />
            <button className="btn btn-outline-secondary" onClick={() => handleQuantityChange(1)}>+</button>
          </div>

          {role === "customer" && (
            <>
              <button className="btn btn-primary me-2" onClick={handleAddToCart}>Add to Cart</button>
              <button className="btn btn-success" onClick={handlePlaceOrder}>Place Order</button>
            </>
          )}
        </div>
      </div>

      <div className="mt-5">
        <h5>⭐ Customer Reviews</h5>
        <hr />
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
            reviews.map((review, index) => (
              <div key={index}>
                <p><strong>Rating:</strong> {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                <p>{review.comment}</p>
                <hr />
              </div>
            ))
        )}
      </div>
    </div>
  );
}
