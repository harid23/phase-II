import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const [customerForm, setCustomerForm] = useState({
    customerName: '',
    phone: '',
    address: '',
    customerCity: ''
  });

  const [sellerForm, setSellerForm] = useState({
    sellerName: username || '', 
    contact: '',
    companyName: '',
    sellerAddress: '',
    sellerCity: ''
  });

  useEffect(() => {
    if (!role || !token) {
      alert("Invalid access. Please login.");
      navigate('/login');
    }
  }, [role, token, navigate]);

  const handleChange = (e, isCustomer = true) => {
    const { name, value } = e.target;
    if (isCustomer) {
      setCustomerForm({ ...customerForm, [name]: value });
    } else {
      setSellerForm({ ...sellerForm, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (role === 'customer') {
        await axios.put("https://localhost:7203/api/customers/edit", customerForm, { headers });

        const res = await axios.get("https://localhost:7203/api/customers/me", { headers });
        const updated = res.data;

        localStorage.setItem("address", updated.address || "");
        localStorage.setItem("phone", updated.phone || "");
        localStorage.setItem("customerCity", updated.customerCity || "");
        localStorage.setItem("customerId", updated.customerId);
      }

      else if (role === 'seller') {
        const sellerData = {
          ...sellerForm,
          sellerName: sellerForm.sellerName || username
        };

        console.log("Sending seller data →", sellerData); 

        await axios.put("https://localhost:7203/api/Sellers/update-myprofile", sellerData, { headers });

        const res = await axios.get("https://localhost:7203/api/Sellers/my-profile", { headers });
        const updated = res.data;

        localStorage.setItem("companyName", updated.companyName || "");
        localStorage.setItem("sellerAddress", updated.sellerAddress || "");
      localStorage.setItem("isProfileComplete", "true");
    }
      alert("✅ Profile updated successfully. You can now login.");
      navigate("/login");

    } catch (err) {
      console.error("❌ Profile update failed", err.response?.data || err.message);
      alert("Profile update failed. Check the inputs and try again.");
    }
  };

  return (
    <div className="container mt-4 p-4 shadow rounded bg-white" style={{ maxWidth: "600px" }}>
      <h4 className="mb-4 text-center">📝 Complete Your Profile</h4>

      {role === 'customer' ? (
        <>
          <div className="mb-3">
            <label>Name</label>
            <input name="customerName" value={customerForm.customerName} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-3">
            <label>Phone</label>
            <input name="phone" value={customerForm.phone} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-3">
            <label>Address</label>
            <input name="address" value={customerForm.address} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-3">
            <label>City</label>
            <input name="customerCity" value={customerForm.customerCity} onChange={handleChange} className="form-control" />
          </div>
        </>
      ) : role === 'seller' ? (
        <>
          <div className="mb-3">
            <label>Seller Name</label>
            <input name="sellerName" value={sellerForm.sellerName} onChange={e => handleChange(e, false)} className="form-control" />
          </div>
          <div className="mb-3">
            <label>Contact</label>
            <input name="contact" value={sellerForm.contact} onChange={e => handleChange(e, false)} className="form-control" />
          </div>
          <div className="mb-3">
            <label>Company</label>
            <input name="companyName" value={sellerForm.companyName} onChange={e => handleChange(e, false)} className="form-control" />
          </div>
          <div className="mb-3">
            <label>Address</label>
            <input name="sellerAddress" value={sellerForm.sellerAddress} onChange={e => handleChange(e, false)} className="form-control" />
          </div>
          <div className="mb-3">
            <label>City</label>
            <input name="sellerCity" value={sellerForm.sellerCity} onChange={e => handleChange(e, false)} className="form-control" />
          </div>
        </>
      ) : (
        <p className="text-danger">Invalid role or session expired.</p>
      )}

      <button className="btn btn-success w-100 mt-3" onClick={handleSubmit}>
        Submit Profile
      </button>
    </div>
  );
}
