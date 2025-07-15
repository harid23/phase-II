import React, { useEffect, useState } from 'react';
import {
  getAllOrdersForAdmin,
  updateOrderStatusByAdmin,
  getAllCustomers,
  getAllSellers
} from '../../../services/orderService';
import { format } from 'date-fns';

export default function AdminOrderManagement() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({
    sellerId: '',
    customerId: '',
    status: ''
  });

  useEffect(() => {
    fetchOrders();
    fetchSellers();
    fetchCustomers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, filters]);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrdersForAdmin();
      setOrders(data);
    } catch (err) {
      console.error("❌ Failed to fetch orders", err);
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

  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("❌ Failed to fetch customers", err);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatusByAdmin(orderId, newStatus);
      fetchOrders(); // Refresh
    } catch (err) {
      console.error("❌ Failed to update status", err);
      alert("Failed to update status");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    let filtered = [...orders];

    if (filters.sellerId) {
      filtered = filtered.filter(o => o.product?.sellerId === parseInt(filters.sellerId));
    }
    if (filters.customerId) {
      filtered = filtered.filter(o => o.customerId === parseInt(filters.customerId));
    }
    if (filters.status) {
      filtered = filtered.filter(o => o.status.toLowerCase() === filters.status.toLowerCase());
    }

    setFilteredOrders(filtered);
  };

  return (
    <div className="container mt-4">
      <h2>📦 Admin Order Management</h2>

      {/* 🔹 Compact Summary Cards */}
      <div className="row mb-3">
        <div className="col-md-4">
          <div className="card text-center bg-primary text-white">
            <div className="card-body py-2">
              <h6 className="fw-bold mb-1">📊 Total Orders</h6>
              <h5>{orders.length}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-light border-success">
            <div className="card-body py-2">
              <h6 className="fw-bold text-success mb-1">✅ Filtered Orders</h6>
              <h5 className="text-success">{filteredOrders.length}</h5>
            </div>
          </div>
        </div>
        {(filters.sellerId || filters.customerId || filters.status) && (
          <div className="col-md-4">
            <div className="card text-center bg-warning">
              <div className="card-body py-2">
                <h6 className="fw-bold text-dark mb-1">🔍 Current Filter</h6>
                <small className="text-dark">
                  {filters.status && `Status: ${filters.status} `}
                  {filters.customerId && `| Customer ID: ${filters.customerId} `}
                  {filters.sellerId && `| Seller ID: ${filters.sellerId}`}
                </small>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🔎 Filter Controls */}
      <div className="row mb-3">
        <div className="col-md-4">
          <select className="form-control" name="sellerId" value={filters.sellerId} onChange={handleFilterChange}>
            <option value="">-- Filter by Seller --</option>
            {sellers.map(s => (
              <option key={s.sellerId} value={s.sellerId}>{s.sellerName}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-control" name="customerId" value={filters.customerId} onChange={handleFilterChange}>
            <option value="">-- Filter by Customer --</option>
            {customers.map(c => (
              <option key={c.customerId} value={c.customerId}>{c.customerName}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-control" name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">-- Filter by Status --</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* 📋 Order Table */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Seller</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? filteredOrders.map(order => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.product?.name}</td>
              <td>{order.seller?.sellerName || "N/A"}</td>
              <td>{order.customer?.username || "N/A"}</td>
              <td>{order.status}</td>
              <td>₹ {order.totalAmount}</td> 
              <td>{format(new Date(order.orderDate), 'dd-MM-yyyy')}</td>
              <td>
                {order.status === "CancellationRequested" && (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleStatusUpdate(order.orderId, "Cancelled")}
                    >
                      Approve Cancel
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleStatusUpdate(order.orderId, "Confirmed")}
                    >
                      Reject Cancel
                    </button>
                  </>
                )}

                {order.status === "Confirmed" && (
                  <>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => handleStatusUpdate(order.orderId, "Shipped")}
                    >
                      Mark as Shipped
                    </button>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleStatusUpdate(order.orderId, "Delivered")}
                    >
                      Mark as Delivered
                    </button>
                  </>
                )}

                {order.status === "Shipped" && (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleStatusUpdate(order.orderId, "Delivered")}
                  >
                    Mark as Delivered
                  </button>
                )}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="8" className="text-center">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
