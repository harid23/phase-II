import React, { useState } from 'react';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
  };

  const validate = () => {
    const errors = {};
    if (!form.username.trim()) errors.username = 'Username is required';
    else if (!/^[a-zA-Z0-9]+$/.test(form.username)) errors.username = 'Only alphanumeric allowed';

    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email format';

    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 6) errors.password = 'Minimum 6 characters';
    else if (!/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(form.password)) errors.password = 'Must be alphanumeric';

    if (!form.confirmPassword) errors.confirmPassword = 'Confirm password required';
    else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    return errors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    try {
      const res = await registerUser(form);
      alert(res.data.message || '✅ Registered successfully!');
      navigate('/login');
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError(
        err.response?.data?.StatusMessage ||
        err.response?.data?.message ||
        'Registration failed'
      );
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h3>Register</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group mb-3">
            <label>Username</label>
            <input
              name="username"
              className="form-control"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
            />
            {fieldErrors.username && <small className="text-danger">{fieldErrors.username}</small>}
          </div>

          <div className="form-group mb-3">
            <label>Email</label>
            <input
              name="email"
              className="form-control"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
            />
            {fieldErrors.email && <small className="text-danger">{fieldErrors.email}</small>}
          </div>

          <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
            />
            {fieldErrors.password && <small className="text-danger">{fieldErrors.password}</small>}
          </div>

          <div className="form-group mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {fieldErrors.confirmPassword && <small className="text-danger">{fieldErrors.confirmPassword}</small>}
          </div>

          <div className="form-group mb-3">
            <label>Role</label>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <button className="btn btn-primary w-100">Register</button>
        </form>
      </div>
    </div>
  );
}
