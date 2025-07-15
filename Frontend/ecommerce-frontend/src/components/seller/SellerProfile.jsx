import React, { useEffect, useState } from 'react';
import SellerService from '../services/sellerService';

export default function SellerProfile() {
  const [profile, setProfile] = useState({
    sellerName: '',
    phone: '',
    email: '',
    sellerCity: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerProfile();
  }, []);

  const fetchSellerProfile = async () => {
    try {
      const data = await SellerService.getMyProfile();
      setProfile(data);
    } catch (err) {
      console.error("❌ Failed to fetch seller profile:", err);
      alert("Error fetching seller data.");
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
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      alert("Profile update failed.");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="container mt-5">
      <h2>🧑‍💼 Seller Profile</h2>
      <form className="mt-4 p-4 border rounded bg-light" onSubmit={handleUpdate}>
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
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={profile.email}
            readOnly
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
    </div>
  );
}
