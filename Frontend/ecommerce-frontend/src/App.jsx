import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import CompleteProfile from './pages/CompleteProfile'; 
import ProductList from './pages/ProductList';
import Cart from './components/customer/Cart';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderHistory from './components/customer/OrderHistory';
import PaymentForm from './pages/PaymentForm';
import CustomerProfile from './components/customer/CustomerProfile';
import SellerDashboard from './components/seller/SellerDashboard';
import ProductManagement from './components/seller/ProductManagement';
import OrderManagement from './components/seller/OrderManagement';
import Unauthorized from './pages/Unauthorized';
import Required from './pages/Required';
import ProtectedRoute from './context/ProtectedRoute';

// Admin Components
import AdminProductManagement from './components/admin/AdminProductManagement';
import AdminOrderManagement from './components/admin/orders/AdminOrderManagement';
import CustomerManagement from './components/admin/customers/CustomerManagement';
import SellerManagement from './components/admin/sellers/SellerManagement';
import CategoryManagement from './components/admin/CategoryManagement';
import AdminProfile from './components/admin/AdminProfile';


export default function App() {
  return (
    <>
      <Navbar />
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
       <Route path="/complete-profile" element={<CompleteProfile />} />

          <Route path="/customer/cart" element={
    <ProtectedRoute allowedRoles={['customer']}>
      <Required>
        <Cart />
      </Required>
    </ProtectedRoute>
  } />

  <Route path="/place-order/:productId" element={
    <ProtectedRoute allowedRoles={['customer']}>
      <Required>
        <PlaceOrderPage />
      </Required>
    </ProtectedRoute>
  } />

  <Route path="/make-payment/:orderId" element={
    <ProtectedRoute allowedRoles={['customer']}>
      <Required>
        <PaymentForm />
      </Required>
    </ProtectedRoute>
  } />

  <Route path="/orders" element={
    <ProtectedRoute allowedRoles={['customer']}>
      <Required>
        <OrderHistory />
      </Required>
    </ProtectedRoute>
  } />

  <Route path="/me" element={
    <ProtectedRoute allowedRoles={['customer']}>
      <Required>
        <CustomerProfile />
      </Required>
    </ProtectedRoute>
  } />

  {/* Protected Routes - SELLER */}
  <Route path="/seller/profile" element={
    <ProtectedRoute allowedRoles={['seller']}>
      <Required>
        <SellerDashboard />
      </Required>
    </ProtectedRoute>
  } />

  <Route path="/seller/products" element={
    <ProtectedRoute allowedRoles={['seller']}>
      <Required>
        <ProductManagement />
      </Required>
    </ProtectedRoute>
  } />

  <Route path="/seller/orders" element={
    <ProtectedRoute allowedRoles={['seller']}>
      <Required>
        <OrderManagement />
      </Required>
    </ProtectedRoute>
  } />

  {/* Protected Routes - ADMIN (no profile check needed) */}
  <Route path="/admin/profile" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminProfile />
    </ProtectedRoute>
  } />

  <Route path="/admin/adminProductmanagement" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminProductManagement />
    </ProtectedRoute>
  } />

  <Route path="/admin/orders" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminOrderManagement />
    </ProtectedRoute>
  } />

  <Route path="/admin/customers" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <CustomerManagement />
    </ProtectedRoute>
  } />

  <Route path="/admin/sellers" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <SellerManagement />
    </ProtectedRoute>
  } />

  <Route path="/admin/CategoryManagement" element={
    <ProtectedRoute allowedRoles={['admin']}>
      <CategoryManagement />
    </ProtectedRoute>
  } />
</Routes>

<Footer />
    </>
  );
}
