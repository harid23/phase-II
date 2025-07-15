import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    setFiltered(
      customers.filter(c =>
        c.customerName.toLowerCase().includes(search.toLowerCase()) ||
        c.customerCity?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, customers]);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://localhost:7203/api/Customers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch customers", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await axios.delete(`https://localhost:7203/api/Customers/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error("❌ Failed to delete customer", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>👥 Admin Customer Management</h2>

      {/* 🔹 Custom Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center bg-success text-white">
            <div className="card-body py-3">
              <h6 className="fw-bold">📊 All Registered Customers</h6>
              <h4>{customers.length}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-light border-info">
            <div className="card-body py-3">
              <h6 className="fw-bold text-info">🔎 Matching Customers</h6>
              <h4 className="text-info">{filtered.length}</h4>
            </div>
          </div>
        </div>
        {search.trim() && (
          <div className="col-md-4">
            <div className="card text-center bg-warning">
              <div className="card-body py-3">
                <h6 className="fw-bold text-dark">📍 Searching for</h6>
                <h6 className="text-dark mb-0">{search}</h6>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🔎 Search Input */}
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Search by name or city"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 📋 Data Table */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(cust => (
            <tr key={cust.customerId}>
              <td>{cust.customerName}</td>
              <td>{cust.phone}</td>
              <td>{cust.customerCity}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cust.customerId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">No customers found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

