import React, { useEffect, useState } from "react";
import { getCustomerProfile, updateCustomerProfile, getWallet } from "../../services/customerService";
import { useNavigate } from "react-router-dom";

export default function CustomerProfile() {
  const [profile, setProfile] = useState({
    customerId: 0,
    customerName: "",
    phone: "",
    address: "",
    customerCity: "",
    isDeleted: false
  });
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      const data = await getCustomerProfile(localStorage.getItem("token"));
      const walletData = await getWallet(data.customerId); 
      setProfile(data);
      setWallet(walletData);
    } catch (err) {
      console.error("❌ Error fetching customer data", err);
      alert("Error fetching profile. Please login again.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateCustomerProfile(profile, localStorage.getItem("token"));
      alert("✅ Profile updated successfully");
    } catch (err) {
      console.error("❌ Update failed", err);
      alert("Profile update failed");
    }
  };

  if (loading) return <p>Loading customer dashboard...</p>;

  return (
    <div className="container mt-4">
      <h2>👤 Customer Dashboard</h2>

      {/* Profile Section */}
      <form className="mt-4 p-4 border rounded bg-light" onSubmit={handleUpdate}>
        <h4>📋 Profile</h4>

        <div className="mb-3">
          <label className="form-label">Customer Name</label>
          <input
            type="text"
            className="form-control"
            name="customerName"
            value={profile.customerName}
            onChange={handleChange}
            required
            style={{ color: '#000' }} 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            required
              style={{ color: '#000' }} 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            name="customerCity"
            value={profile.customerCity}
            onChange={handleChange}
            required
              style={{ color: '#000' }} 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            className="form-control"
            name="address"
            value={profile.address}
            onChange={handleChange}
            required
              style={{ color: '#000' }} 
          />
        </div>

        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>

      {/* Wallet Section */}
      <div className="mt-5 p-4 border rounded bg-light">
        <h4>💰 Wallet</h4>
        <p><strong>Wallet Balance:</strong> ₹{wallet?.balance ?? 0}</p>
      </div>
    </div>
  );
}
