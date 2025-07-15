import axios from 'axios';

const API = "https://localhost:7203/api";

export const addToCart = (productId, quantity, token) => {
  return axios.post(`${API}/Carts/add`, {
    productId,
    quantity
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getCartItems = async (token) => {
  const res = await axios.get(`${API}/Carts/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const removeFromCart = async (cartItemId, token) => {
  await axios.delete(`${API}/Carts/remove/${cartItemId}`, {
    data: { cartItemId },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const checkoutCart = async (cartItemId, address, quantity, token) => {
  const res = await axios.post(`${API}/Orders/checkout-cart/${cartItemId}`, null, {
    params: { address, quantity },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};


