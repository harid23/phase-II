import React, { useEffect, useState } from 'react';
import { getAllSellers, deleteSeller } from '../../../services/sellerService';
import SellerTable from './SellerTable';

export default function AdminSellerManagement() {
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterName, filterStatus, sellers]);

  const fetchSellers = async () => {
    try {
      const data = await getAllSellers();
      setSellers(data);
    } catch (err) {
      console.error("❌ Failed to fetch sellers", err);
    }
  };

  const applyFilters = () => {
    let filtered = [...sellers];
    if (filterName) {
      filtered = filtered.filter(s =>
        s.username?.toLowerCase().includes(filterName.toLowerCase()) ||
        s.sellerCity?.toLowerCase().includes(filterName.toLowerCase())
      );
    }
    if (filterStatus) {
      const isDeleted = filterStatus === 'inactive';
      filtered = filtered.filter(s => s.isDeleted === isDeleted);
    }
    setFilteredSellers(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to soft delete this seller?")) return;
    try {
      await deleteSeller(id);
      fetchSellers();
    } catch (err) {
      console.error("❌ Delete failed", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>👨‍💼 Admin Seller Management</h2>

      {/* 🔹 Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center bg-success text-white">
            <div className="card-body py-3">
              <h6 className="fw-bold">📊 All Registered Sellers</h6>
              <h4>{sellers.length}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-light border-info">
            <div className="card-body py-3">
              <h6 className="fw-bold text-info">🔎 Matching Sellers</h6>
              <h4 className="text-info">{filteredSellers.length}</h4>
            </div>
          </div>
        </div>
        {filterName.trim() && (
          <div className="col-md-4">
            <div className="card text-center bg-warning">
              <div className="card-body py-3">
                <h6 className="fw-bold text-dark">📍 Searching for</h6>
                <h6 className="text-dark mb-0">{filterName}</h6>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🔎 Search + Filter */}
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search by username or city"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* 📋 Seller Table */}
      <SellerTable sellers={filteredSellers} onDelete={handleDelete} />
    </div>
  );
}
