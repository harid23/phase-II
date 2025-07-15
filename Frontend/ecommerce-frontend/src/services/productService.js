import axios from "axios";

const API_BASE_URL = "https://localhost:7203/api/Products";
const API_Reviews = "https://localhost:7203/api/Review";


const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getAllProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/all`);
  return response.data;
};

export const getProductById = async (productId) => {
  const response= await axios.get(`${API_BASE_URL}/by-id/${productId}`);
  return response.data;
};

export const getProductsByName = async (name) => {
  const response = await axios.get(`${API_BASE_URL}/by-name/${name}`);
  return response.data;
};

export const getProductsByCategory = async (category) => {
  const response = await axios.get(`${API_BASE_URL}/by-category/${category}`);
  return response.data;
};

export const getProductsByPrice = async (price) => {
  const response = await axios.get(`${API_BASE_URL}/by-price/${price}`);
  return response.data;
};

// Seller
export const getMyProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/my-products`, getAuthHeader());
  return response.data;
};


export const addProduct = async (product) => {
  const response = await axios.post(`${API_BASE_URL}/add`, product, getAuthHeader());
  return response.data;
};


export const updateProduct = async (productId, product) => {
  const response = await axios.put(`${API_BASE_URL}/update/${productId}`, product, getAuthHeader());
  return response.data;
};


export const deleteProduct = async (productId) => {
  const response = await axios.delete(`${API_BASE_URL}/delete/${productId}`, getAuthHeader());
  return response.data;
};


export const uploadProductImage = async (productId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${API_BASE_URL}/${productId}/upload-image`, formData, {
    ...getAuthHeader(),
    headers: {
      ...getAuthHeader().headers,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
export const getReviewsByProductId = async (productId) => {
  const res = await axios.get(`${API_Reviews}/product/${productId}`);
  return res.data;
};