import axios from 'axios';

const API_URL = "https://localhost:7203/api/Sellers";
const WALLET_URL = "https://localhost:7203/api/Wallet/seller";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});


export const getAllSellers = async () => {
  const response = await axios.get(`${API_URL}/get-all`, getAuthHeader());
  return response.data;
};


export const deleteSeller = async (sellerId) => {
  const res = await axios.delete(`${API_URL}/delete/${sellerId}`, getAuthHeader());
  return res.data;
};

const SellerService = {
  getMyProfile: async () => {
    const res = await axios.get(`${API_URL}/my-profile`, getAuthHeader());
    return res.data;
  },

  updateProfile: async (sellerData) => {
    const res = await axios.put(`${API_URL}/update`, sellerData, getAuthHeader());
    return res.data;
  },

  getWallet: async () => {
    const sellerId = localStorage.getItem("sellerId");
    const token = localStorage.getItem("token");

    const res = await axios.get(`${WALLET_URL}/${sellerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  },
};

export default SellerService;
