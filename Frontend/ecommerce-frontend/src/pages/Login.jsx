import { useState } from 'react';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ userName: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      const token = res.data.token;

      const payload = JSON.parse(atob(token.split('.')[1]));

      const username =
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || payload.name;

      const userId =
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || payload.sub;

      const role =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload.role;

      if (!username || !userId || !role) {
        throw new Error("Missing user info in token");
      }

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role.toLowerCase());

      login(token, role.toLowerCase(), username);

      const headers = { Authorization: `Bearer ${token}` };

      if (role.toLowerCase() === "customer") {
        const res = await axios.get("https://localhost:7203/api/customers/me", { headers });
        const customer = res.data;

        localStorage.setItem("customerId", customer.customerId);
        localStorage.setItem("address", customer.address || "");
        localStorage.setItem("phone", customer.phone || "");
        localStorage.setItem("customerCity", customer.customerCity || "");
      } else if (role.toLowerCase() === "seller") {
        const res = await axios.get("https://localhost:7203/api/sellers/my-profile", { headers });
        const seller = res.data;

        localStorage.setItem("sellerId", seller.sellerId);
        localStorage.setItem("companyName", seller.companyName || "");
        localStorage.setItem("sellerAddress", seller.sellerAddress || "");
      } else if (role.toLowerCase() === "admin") {
        //const res = await axios.get("https://localhost:7203/api/admins/me", { headers });
        const admin = res.data;
        localStorage.setItem("adminId", admin.adminId);
      }

      alert("✅ Login successful! Welcome " + username);
      navigate("/");
    } catch (err) {
      console.error("❌ Login failed:", err.message);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-wrapper d-flex flex-column align-items-center">
      <div className="login-container">
        <h3>Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group mb-3">
            <label>Username</label>
            <input
              name="userName"
              className="form-control"
              placeholder="Enter username"
              value={form.userName}
              onChange={handleChange}
              required
            />
            {!form.userName && error && (
              <small className="text-danger">Username is required</small>
            )}
            {form.userName && !/^[a-zA-Z0-9]+$/.test(form.userName) && (
              <small className="text-danger">Alphanumeric only</small>
            )}
          </div>

          <div className="form-group mb-3">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
            {!form.password && error && (
              <small className="text-danger">Password is required</small>
            )}
            {form.password && form.password.length > 6 && (
              <small className="text-danger">Max 6 characters allowed</small>
            )}
            {form.password && !/[!@#$%^&*]/.test(form.password) && (
              <small className="text-danger">Include at least 1 special character</small>
            )}
          </div>

          <button className="btn btn-primary w-100">Login</button>
        </form>

        {/* 🔹 Forgot Password Link */}
        <div className="text-center mt-3">
          <a
            href="/forgot-password"
            style={{ color: "#4a90e2", fontWeight: "bold", textDecoration: "none" }}
          >
            Forgot Password?
          </a>
        </div>
      </div>

      {/* 🔹 Register Link (outside card, below) */}
      <div className="text-center mt-3">
        <p>
          Don’t have an account?{" "}
          <a
            href="/register"
            style={{ color: "#4a90e2", fontWeight: "bold", textDecoration: "none" }}
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
