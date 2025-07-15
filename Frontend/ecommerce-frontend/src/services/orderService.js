import axios from 'axios';
import { getAuthHeader } from './authHeader'; 

const API = "https://localhost:7203/api/Orders";

export const placeOrder = async (order) => {
  try {
    const response = await axios.post(`${API}/placeOrder`, order, {
      headers: getAuthHeader()
    }); 
    return response.data.orderId;
  } catch (err) {
    throw err;
  }
};

export const getSellerOrders = async (sellerId) => {
  try {
    const response = await axios.get(`${API}/get-orders-by-seller-id/${sellerId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (err) {
    console.error("❌ Failed to fetch seller orders:", err);
    throw err;
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const response = await fetch(`${API}/update-status/${orderId}`, {
    method: "PUT",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newStatus),
  });

  if (!response.ok) throw new Error("Failed to update status");
  return response.json();
};

export const handleCancelRequest = async (orderId, approve) => {
  const response = await fetch(`${API}/process-cancel/${orderId}?approve=${approve}`, {
    method: "POST",
    headers: getAuthHeader()
  });

  const resultText = await response.text();
  if (!response.ok) {
    console.error("Cancel error:", resultText);
    throw new Error(resultText);
  }

  return resultText;
};

export const getAllOrdersForAdmin = async () => {
  const response = await axios.get(`${API}/admin-all-orders`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const updateOrderStatusByAdmin = async (orderId, newStatus) => {
  const response = await axios.put(`${API}/update-status/${orderId}`, newStatus, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json"
    }
  });
  return response.data;
};

export const getAllCustomers = async () => {
  const response = await axios.get(`https://localhost:7203/api/Customers`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getAllSellers = async () => {
  const response = await axios.get(`https://localhost:7203/api/Sellers/get-all`, {
    headers: getAuthHeader()
  });
  return response.data;
};
