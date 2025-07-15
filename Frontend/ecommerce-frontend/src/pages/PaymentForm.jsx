import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PaymentForm() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [walletBalance, setWalletBalance] = useState(null);
  const [paymentData, setPaymentData] = useState({
    customerId: '',
    orderId: orderId,
    paymentMethod: 'Wallet',
    totalAmount: '',
    address: '',
    upiId: '',
    cardNumber: '',
    cardHolder: '',
    expiry: ''
  });

  useEffect(() => {
    if (orderId) fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    if (paymentData.paymentMethod === "Wallet") fetchWalletBalance();
  }, [paymentData.paymentMethod]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`https://localhost:7203/api/Orders/get-order-by-id/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const order = res.data;
      setPaymentData(prev => ({
        ...prev,
        customerId: order.customerId,
        totalAmount: order.totalAmount,
        address: order.shippingAddress || ''
      }));
    } catch (err) {
      console.error("❌ Failed to load order details", err);
      alert("Failed to load order details");
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const customerId = localStorage.getItem("customerId");
      const res = await axios.get(`https://localhost:7203/api/Wallet/customer/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWalletBalance(res.data.balance);
    } catch (err) {
      console.error("⚠️ Failed to fetch wallet balance", err);
      setWalletBalance(null);
    }
  };

  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const method = paymentData.paymentMethod;
      if (method === "UPI" && !paymentData.upiId.trim()) {
        return alert("⚠️ Please enter a valid UPI ID.");
      }

      if ((method === "CreditCard" || method === "DebitCard")) {
        if (!paymentData.cardNumber.trim() || paymentData.cardNumber.length < 12)
          return alert("⚠️ Please enter a valid card number.");
        if (!paymentData.cardHolder.trim())
          return alert("⚠️ Cardholder name is required.");
        if (!paymentData.expiry.trim() || !/^\d{2}\/\d{2}$/.test(paymentData.expiry))
          return alert("⚠️ Please enter expiry in MM/YY format.");
      }

      const token = localStorage.getItem("token");
      const payload = {
        customerId: paymentData.customerId,
        orderId: paymentData.orderId,
        paymentMethod: method
      };

      const res = await axios.post("https://localhost:7203/api/Payments/make", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ " + res.data.message);
      navigate("/orders");

    } catch (err) {
      const msg = err.response?.data?.Message || err.response?.data?.Error || err.message;
      console.error("❌ Payment failed", err);
      alert("❌ Payment failed: " + msg);
    }
  };

  return (
    <div className="container mt-4 p-4 rounded shadow bg-light">
      <h4>💳 Complete Your Payment</h4>

      <div className="mb-3">
        <label>Shipping Address</label>
        <input
          className="form-control"
          name="address"
          value={paymentData.address}
          onChange={handleChange}
          disabled
        />
      </div>

      <div className="mb-3">
        <label>Payment Method</label>
        <select
          className="form-select"
          name="paymentMethod"
          value={paymentData.paymentMethod}
          onChange={handleChange}
        >
          <option value="Wallet">Wallet</option>
          <option value="UPI">UPI</option>
          <option value="CreditCard">Credit Card</option>
          <option value="DebitCard">Debit Card</option>
        </select>
      </div>

      {paymentData.paymentMethod === "Wallet" && (
        <div className="alert alert-info">
          💰 Wallet Balance: ₹{walletBalance !== null ? walletBalance : '...'}
        </div>
      )}

      {paymentData.paymentMethod === "UPI" && (
        <div className="mb-3">
          <label>Enter UPI ID</label>
          <input
            type="text"
            className="form-control"
            name="upiId"
            value={paymentData.upiId}
            onChange={handleChange}
            placeholder="example@upi"
          />
        </div>
      )}

      {(paymentData.paymentMethod === "CreditCard" || paymentData.paymentMethod === "DebitCard") && (
        <>
          <div className="mb-3">
            <label>Card Number</label>
            <input
              type="text"
              className="form-control"
              name="cardNumber"
              value={paymentData.cardNumber}
              onChange={handleChange}
              placeholder="xxxx xxxx xxxx xxxx"
            />
          </div>
          <div className="mb-3">
            <label>Cardholder Name</label>
            <input
              type="text"
              className="form-control"
              name="cardHolder"
              value={paymentData.cardHolder}
              onChange={handleChange}
              placeholder="Name"
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Expiry Date</label>
              <input
                type="text"
                className="form-control"
                name="expiry"
                value={paymentData.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
              />
            </div>
          </div>
        </>
      )}

      <div className="mb-3">
        <strong>Total Amount: ₹{paymentData.totalAmount}</strong>
      </div>

      <button className="btn btn-success" onClick={handleSubmit}>
        Make Payment
      </button>
    </div>
  );
}
