import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReviewOrderId, setActiveReviewOrderId] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [customerId, setCustomerId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://localhost:7203/api/Orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      if (res.data.length > 0) {
        setCustomerId(res.data[0].customerId);
      }
    } catch (err) {
      console.error("❌ Failed to load orders:", err);
      alert("Unable to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId, orderStatus) => {
    let reason = "";
    if (orderStatus === "Delivered") {
      reason = prompt("Enter reason for cancelling the delivered order:");
      if (!reason || reason.trim() === "") {
        alert("❌ Reason is required for cancelling a delivered order.");
        return;
      }
    }

    try {
      await axios.post(
        `https://localhost:7203/api/Orders/request-cancel/${orderId}`,
        { reason: reason || "Customer requested cancellation." },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Cancellation request submitted");
      fetchOrders();
    } catch (err) {
      console.error("Cancel failed", err);
      alert("❌ Cancel failed");
    }
  };

  const handleReviewClick = (orderId) => {
    setActiveReviewOrderId(orderId === activeReviewOrderId ? null : orderId);
    setReviewForm({ rating: 5, comment: '' });
  };

  const handleReviewSubmit = async (productId) => {
    try {
      await axios.post(`https://localhost:7203/api/Review`, {
        productId,
        customerId,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Review submitted");
      setActiveReviewOrderId(null);
      fetchOrders();
    } catch (err) {
      console.error("Review failed", err);
      alert("❌ Review failed");
    }
  };

  const handleInputChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handlePayNow = (orderId) => {
    navigate(`/make-payment/${orderId}`);
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="container mt-5">
      <h2>🧾 Order History</h2>
      <table className="table table-bordered mt-4">
        <thead className="table-dark">
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Total Price</th>
            <th>Order Status</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <React.Fragment key={order.orderId}>
              <tr>
                <td>{order.orderId}</td>
                <td>{order.product?.name || 'N/A'}</td>
                <td>{order.quantity}</td>
                <td>₹{order.totalAmount}</td>
                <td>{order.status}</td>
                <td>
                  {order.paymentStatus === "Paid" ? (
                    <span className="badge bg-success">Paid</span>
                  ) : (
                    <span className="badge bg-warning text-dark">Unpaid</span>
                  )}
                </td>
                <td>
                  {order.paymentStatus !== "Paid" ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handlePayNow(order.orderId)}
                    >
                      Pay Now
                    </button>
                  ) : (
                    <>
                      {['Placed', 'Confirmed'].includes(order.status) && (
                        <button
                          className="btn btn-danger btn-sm me-2"
                          onClick={() => handleCancel(order.orderId, order.status)}
                        >
                          Cancel
                        </button>
                      )}
                      {order.status === 'Delivered' && (
                        <>
                          <button
                            className="btn btn-danger btn-sm me-2"
                            onClick={() => handleCancel(order.orderId, order.status)}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleReviewClick(order.orderId)}
                          >
                            Review
                          </button>
                        </>
                      )}
                    </>
                  )}
                </td>
              </tr>

              {activeReviewOrderId === order.orderId && (
                <tr>
                  <td colSpan="7">
                    <form
                      className="p-3 border rounded bg-light"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleReviewSubmit(order.productId);
                      }}
                    >
                      <div className="mb-2">
                        <label>Rating (1-5)</label>
                        <input
                          type="number"
                          name="rating"
                          min="1"
                          max="5"
                          className="form-control"
                          value={reviewForm.rating}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label>Comment</label>
                        <textarea
                          name="comment"
                          className="form-control"
                          rows="3"
                          value={reviewForm.comment}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <button className="btn btn-primary me-2" type="submit">Submit Review</button>
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => setActiveReviewOrderId(null)}
                      >
                        Cancel
                      </button>
                    </form>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
