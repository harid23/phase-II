import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { token, role, logout } = useAuth();
  const isAuthenticated = !!token; 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">E-Commerce</Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>
        </ul>

        <ul className="navbar-nav">
          {!token ? (
            <>
              <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
            </>
          ) : (
            <>
              {role === 'customer' && (
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="accountDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    My Account
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
                    <li><Link className="dropdown-item" to="/me">👤 Profile</Link></li>
                    <li><Link className="dropdown-item" to="/orders">🧾 Order History</Link></li>
                    <li><Link className="dropdown-item" to="/customer/cart">🛒 Cart</Link></li>
                  </ul>
                </li>
              )}

              {role === 'seller' && (
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    Seller Account
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><NavLink className="dropdown-item" to="/seller/profile">My Profile</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/seller/products">Product Management</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/seller/orders">Order Management</NavLink></li>
                  </ul>
                </li>
              )}

              {role === 'admin' && (
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    Admin Dashboard
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                     <li><NavLink className="dropdown-item" to="/admin/profile">Profile</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/admin/adminProductManagement">Product Management</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/admin/CategoryManagement">Category Management</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/admin/sellers">Seller Management</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/admin/customers">Customer Management</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/admin/orders">Order Management</NavLink></li>
                  </ul>
                </li>
              )}

              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
