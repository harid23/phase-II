import React, { useEffect, useState } from 'react';
import {
  getSellerOrders,
  updateOrderStatus,
  handleCancelRequest
} from '../../services/orderService'; 

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
  try {
    const sellerId = localStorage.getItem("sellerId"); 
    if (!sellerId) {
      alert("❌ sellerId missing. Please log in again.");
      return;
    }

    const data = await getSellerOrders(parseInt(sellerId)); 
    setOrders(data);
  } catch (err) {
    console.error("❌ Failed to fetch seller orders:", err);
    alert("❌ Failed to fetch seller orders");
  } finally {
    setLoading(false);
  }
};


  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      alert("✅ Status updated");
      fetchOrders();
    } catch (err) {
      alert("❌ Failed to update status");
    }
  };

  const handleCancelAction = async (orderId, approve) => {
    try {
      await handleCancelRequest(orderId, approve);
      alert(approve ? "✅ Cancel request approved" : "❌ Cancel request rejected");
      fetchOrders();
    } catch (err) {
      alert("❌ Failed to handle cancel request");
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="container mt-4">
      <h2>📦 Seller Order Management</h2>
      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Cancel Reason</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.product?.name ??"N/A" }</td>
              <td>{order.customer?.customerName ?? "N/A"}</td>
              <td>{order.status}</td>
              <td>{order.cancelReason || '--'}</td>
              <td>
                {order.status?.toLowerCase() === "cancellationrequested".toLowerCase() && (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleCancelAction(order.orderId, true)}
                    >
                      Approve Cancel
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancelAction(order.orderId, false)}
                    >
                      Reject Cancel
                    </button>
                  </>
                )}
                {order.status === "Confirmed" && (
                  <>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleStatusChange(order.orderId, "Shipped")}
                    >
                      Mark as Shipped
                    </button>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleStatusChange(order.orderId, "Delivered")}
                    >
                      Mark as Delivered
                    </button>
                  </>
                )}

                {order.status === "Shipped" && (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleStatusChange(order.orderId, "Delivered")}
                  >
                    Mark as Delivered
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
