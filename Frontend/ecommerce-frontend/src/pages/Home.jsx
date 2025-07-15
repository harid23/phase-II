import React from "react";
import { FaUsers, FaBoxOpen, FaShoppingCart, FaStore } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f0f8ff", color: "#333" }}>
      <header style={{ background: "#007bff", padding: "2rem 1rem", textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>Welcome to QuitQ</h1>
        <p style={{ fontSize: "1.2rem" }}>India's Fastest Growing E-Commerce Platform</p>
      </header>

      <section style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", padding: "3rem 1rem", background: "white" }}>
        <StatCard icon={<FaUsers size={40} color="#007bff" />} count="100+" label="Customers" />
        <StatCard icon={<FaStore size={40} color="#007bff" />} count="50+" label="Sellers" />
        <StatCard icon={<FaBoxOpen size={40} color="#007bff" />} count="1500+" label="Products" />
        <StatCard icon={<FaShoppingCart size={40} color="#007bff" />} count="3000+" label="Orders" />
      </section>

      <section style={{ background: "#e6f2ff", padding: "3rem 1rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#007bff" }}>What We Offer</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
          {[
            { title: "Secure Payments", desc: "Multiple payment methods for your ease." },
            { title: "Fast Checkout", desc: "Place orders within seconds with minimal clicks." },
            { title: "Smart Inventory", desc: "Real-time product tracking and updates." },
            { title: "Trusted Sellers", desc: "Only verified sellers with quality assurance." }
          ].map((item, idx) => (
            <div key={idx} style={{ background: "white", padding: "1.5rem", borderRadius: "10px", boxShadow: "0 0 15px rgba(0,0,0,0.1)" }}>
              <h3 style={{ color: "#007bff" }}>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <a
          href="/login"
          style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            background: "#007bff",
            color: "white",
            fontWeight: "bold",
            borderRadius: "30px",
            textDecoration: "none",
            boxShadow: "0 5px 10px rgba(0,0,0,0.1)"
          }}
        >
          Go to Login
        </a>
      </div>

    </div>
  );
}

function StatCard({ icon, count, label }) {
  return (
    <div style={{ flex: "1", minWidth: "180px", margin: "1rem", padding: "2rem", background: "#e6f2ff", borderRadius: "10px", textAlign: "center" }}>
      <div>{icon}</div>
      <h2 style={{ fontSize: "2rem", margin: "0.5rem 0" }}>{count}</h2>
      <p style={{ fontWeight: "bold", color: "#007bff" }}>{label}</p>
    </div>
  );
}
