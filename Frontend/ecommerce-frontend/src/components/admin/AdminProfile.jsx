import React, { useEffect, useState } from "react";
import { FaUsers, FaBoxOpen, FaShoppingCart, FaStore, FaRupeeSign } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ products: 0, customers: 0, sellers: 0, orders: 0 });
  const [topProducts] = useState([
    { name: " 📈 iPhone 15pro-Max", sales: 1200 },
    { name: "Nike -Air Force 1", sales: 950 },
    { name: "Hot Wheels", sales: 760 },
    { name: "Cetaphil", sales: 630 }
  ]);

  const pieData = [
    { name: "Chennai", value: 400 },
    { name: "Bangalore", value: 300 },
    { name: "Mumbai", value: 300 },
    { name: "Delhi", value: 200 },
  ];

  const barData = [
    { category: "Electronics", sales: 3000 },
    { category: "Clothing", sales: 1800 },
    { category: "Home", sales: 1200 },
    { category: "Beauty Products", sales: 800 }
  ];

  const COLORS = ["#007bff", "#00c49f", "#ffbb28", "#ff8042"];
  const username = localStorage.getItem("username") || "Admin";

  useEffect(() => {
    fetchCounts();
  }, []);
const fetchCounts = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const [prod, cust, sell, ord] = await Promise.all([
      axios.get("https://localhost:7203/api/Admins/count/products", { headers }),
      axios.get("https://localhost:7203/api/Admins/count/customers", { headers }),
      axios.get("https://localhost:7203/api/Admins/count/sellers", { headers }),
      axios.get("https://localhost:7203/api/Admins/count/orders", { headers }),
    ]);

   setCounts({
      products: prod.data.totalProducts,
      customers: cust.data.totalCustomers,
      sellers: sell.data.totalSellers,
      orders: ord.data.totalOrders
    });
  } catch (err) {
    console.error("Failed to fetch counts", err);
  }
};
  return (
    <div style={{ fontFamily: "Segoe UI", background: "#f4f9ff", color: "#333", padding: "2rem" }}>
    <h1>Welcome Back, {username} 👋</h1>
      <h2 style={{ textAlign: "center", color: "#007bff", marginBottom: "2rem" }}>👨‍💼 Admin Dashboard</h2>

      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "1rem", marginBottom: "3rem" }}>
        <SummaryCard icon={<FaBoxOpen size={30} color="#007bff" />} count={counts.products} label="Products" />
        <SummaryCard icon={<FaUsers size={30} color="#007bff" />} count={counts.customers} label="Customers" />
        <SummaryCard icon={<FaStore size={30} color="#007bff" />} count={counts.sellers} label="Sellers" />
        <SummaryCard icon={<FaShoppingCart size={30} color="#007bff" />} count={counts.orders} label="Orders" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
        <div style={{ background: "white", borderRadius: "10px", padding: "1rem", boxShadow: "0 0 15px rgba(0,0,0,0.1)" }}>
          <h5 style={{ color: "#007bff" }}>📦 Category-wise Sales</h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "white", borderRadius: "10px", padding: "1rem", boxShadow: "0 0 15px rgba(0,0,0,0.1)" }}>
          <h5 style={{ color: "#007bff" }}>🌍 Customer Distribution</h5>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
                isAnimationActive={true}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginTop: "3rem" }}>
        <div style={{ background: "#fff", borderRadius: "10px", padding: "2rem", boxShadow: "0 0 15px rgba(0,0,0,0.1)" }}>
          <h4 style={{ color: "#007bff" }}>💰 Total Revenue</h4>
          <p style={{ fontSize: "2rem", color: "#28a745" }}><FaRupeeSign /> 12,45,000+</p>
        </div>

        <div style={{ background: "#fff", marginTop: "2rem", borderRadius: "10px", padding: "2rem", boxShadow: "0 0 15px rgba(0,0,0,0.1)" }}>
          <h4 style={{ color: "#007bff" }}>🔥 Top Selling Products</h4>
          <ul style={{ padding: 0, listStyle: "none" }}>
            {topProducts.map((p, idx) => (
              <li key={idx} style={{ borderBottom: "1px solid #ddd", padding: "0.5rem 0" }}>
                <strong>{p.name}</strong> — {p.sales} units sold
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon, count, label }) {
  return (
    <div style={{ flex: 1, minWidth: "200px", background: "#e6f2ff", padding: "1.5rem", borderRadius: "12px", textAlign: "center", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
      <div style={{ marginBottom: "0.5rem" }}>{icon}</div>
      <h2 style={{ color: "#007bff", fontSize: "1.8rem" }}>{count}</h2>
      <p style={{ fontWeight: "bold" }}>{label}</p>
    </div>
  );
}
