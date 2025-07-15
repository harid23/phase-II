import React, { useEffect, useState } from 'react';
import { getCartItems, removeFromCart, checkoutCart } from '../../services/cartService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();


  const fetchCart = async () => {
    try {
      setLoading(true);
      const cartData = await getCartItems(token);
      setItems(cartData); 
    } catch (err) {
      console.error("❌ Failed to fetch cart", err);
      alert("Failed to load cart items.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId, token);
      alert("Item removed from cart");
      fetchCart();
    } catch (err) {
      console.error("❌ Failed to remove item", err);
      alert("Remove failed");
    }
  };

const handleCheckout = async (cartItemId) => {
  try {
    const address = prompt("Enter shipping address:");
    if (!address) return;

    const selectedQty = quantities[cartItemId] || 1;
    const token = localStorage.getItem("token");
    const response = await checkoutCart(cartItemId, address, selectedQty, token);
    const orderId = response?.orderId;
    if (!orderId) {
      alert("Order placed, but no orderId returned.");
      return;
    }

    alert("✅ Order placed successfully! Redirecting to payment...");
    navigate(`/make-payment/${orderId}`);
  } catch (err) {
    console.error("❌ Checkout failed", err);
    alert(err.response?.data?.message || "Checkout failed");
  }
};

const handleCheckoutAll = async () => {
  try {
    const address = prompt("Enter shipping address for all items:");
    if (!address) return;

    for (const item of items) {
      const selectedQty = quantities[item.cartItemId] || item.quantity;
      await checkoutCart(item.cartItemId, address, selectedQty, token);
    }

    alert("✅ All items checked out successfully! Redirecting to your orders...");
    navigate("/my-orders"); 
  } catch (err) {
    console.error("❌ Checkout all failed", err);
    alert("Checkout all failed");
  }
};

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.product?.price * item.quantity, 0);
  };

  useEffect(() => {
    fetchCart();
  }, []);

return (
  <div className="container mt-4">
    <h3>🛒 Your Cart</h3>
    {loading ? (
      <p>Loading...</p>
    ) : items.length === 0 ? (
      <p>No items in cart.</p>
    ) : (
      <>
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Product</th>
              <th>Price (₹)</th>
              <th>Quantity</th>
              <th>Subtotal (₹)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.cartItemId}>
                <td>{item.product?.name}</td>
                <td>{item.product?.price}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-sm btn-outline-secondary me-1"
                      onClick={() =>
                        setQuantities((prev) => ({
                          ...prev,
                          [item.cartItemId]: Math.max((prev[item.cartItemId] || item.quantity) - 1, 1),
                        }))
                      }
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      className="form-control form-control-sm text-center"
                      style={{ width: "60px" }}
                      value={quantities[item.cartItemId] || item.quantity}
                      onChange={(e) =>
                        setQuantities((prev) => ({
                          ...prev,
                          [item.cartItemId]: parseInt(e.target.value) || 1,
                        }))
                      }
                    />
                    <button
                      className="btn btn-sm btn-outline-secondary ms-1"
                      onClick={() =>
                        setQuantities((prev) => ({
                          ...prev,
                          [item.cartItemId]: (prev[item.cartItemId] || item.quantity) + 1,
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>
                  ₹
                  {(item.product?.price || 0) *
                    (quantities[item.cartItemId] || item.quantity)}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-danger me-2"
                    onClick={() => handleRemove(item.cartItemId)}
                  >
                    Remove
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleCheckout(item.cartItemId)}
                  >
                    Checkout
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-end fw-bold">Total</td>
              <td colSpan="2" className="fw-bold">
                ₹
                {items.reduce(
                  (sum, item) =>
                    sum +
                    (item.product?.price || 0) *
                      (quantities[item.cartItemId] || item.quantity),
                  0
                )}
              </td>
            </tr>
          </tfoot>
        </table>
        <div className="text-end">
          <button className="btn btn-success" onClick={() => handleCheckoutAll()}>
            Checkout All
          </button>
        </div>
      </>
    )}
  </div>
);
}
