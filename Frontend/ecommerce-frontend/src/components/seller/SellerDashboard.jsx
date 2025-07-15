import React, { useEffect, useState } from "react";
import SellerService from "../../services/sellerService";

export default function SellerDashboard() {
  const [profile, setProfile] = useState({
    sellerId: 0,
    sellerName: "",
    userId: "",
    contact: "",
    companyName: "",
    sellerAddress: "",
    sellerCity: "",
    isDeleted: false
  });

  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      const profileData = await SellerService.getMyProfile();
      const walletData = await SellerService.getWallet();
      setProfile(profileData);
      setWallet(walletData);
    } catch (err) {
      console.error("❌ Error fetching dashboard data", err);
      alert("Failed to load dashboard data");
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
      await SellerService.updateProfile(profile);
      alert("✅ Profile updated successfully");
    } catch (err) {
      console.error("❌ Update failed", err);
      alert("Profile update failed");
    }
  };

  if (loading) return <p>Loading seller dashboard...</p>;

  return (
    
    <div className="container mt-4">
      <h4>Welcome, {localStorage.getItem("username")}</h4>
      <h2>🧑‍💼 Seller Dashboard</h2>

      {/* Profile Section */}
      <form className="mt-4 p-4 border rounded bg-light" onSubmit={handleUpdate}>
        <h4>👤 Profile</h4>

        <div className="mb-3">
          <label className="form-label">Seller Name</label>
          <input
            type="text"
            className="form-control"
            name="sellerName"
            value={profile.sellerName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contact</label>
          <input
            type="text"
            className="form-control"
            name="contact"
            value={profile.contact}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email (read-only)</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={profile.user?.email || ""}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            className="form-control"
            name="companyName"
            value={profile.companyName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Seller Address</label>
          <input
            type="text"
            className="form-control"
            name="sellerAddress"
            value={profile.sellerAddress}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            name="sellerCity"
            value={profile.sellerCity}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>

      {/* Wallet Section */}
      <div className="mt-5 p-4 border rounded bg-light">
        <h4>💰 Wallet</h4>
        <p><strong>Wallet Balance:</strong> ₹{wallet?.balance ?? 0}</p>
        <p><strong>Commission Info:</strong> App takes 20%, seller keeps 80%</p>
      </div>
    </div>
  );
}
