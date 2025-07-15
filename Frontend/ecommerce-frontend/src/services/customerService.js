import axios from 'axios';

const API = "https://localhost:7203/api/Customers";
const WALLET_URL = "https://localhost:7203/api/Wallet/customer";

export const getCustomerProfile = async (token) => {
  const res = await axios.get(`${API}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateCustomerProfile = async (customer, token) => {
  const res = await axios.put(`${API}/edit`, customer, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return res.data;
};
export const getWallet = async () => {
  const token = localStorage.getItem("token");
  const customerId = localStorage.getItem("customerId");
  const res = await axios.get(`${WALLET_URL}/${customerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },  
  });
  return res.data;
};