// src/services/categoryService.js
import axios from 'axios';

const API_BASE_URL = "https://localhost:7203/api/Category";

// ✅ Public: Get all categories
export const getAllCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data;
};

// ✅ Public: Get active categories (e.g., not soft-deleted)
export const getActiveCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/active`);
  return response.data;
};

// ✅ Admin: Add new category
export const addCategory = async (categoryData, token) => {
  const response = await axios.post(`${API_BASE_URL}`, categoryData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ✅ Admin: Update existing category
export const updateCategory = async (categoryId, updatedData, token) => {
  const response = await axios.put(`${API_BASE_URL}/${categoryId}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ✅ Admin: Delete category
export const deleteCategory = async (categoryId, token) => {
  const response = await axios.delete(`${API_BASE_URL}/${categoryId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ✅ Get category by ID
export const getCategoryById = async (categoryId) => {
  const response = await axios.get(`${API_BASE_URL}/${categoryId}`);
  return response.data;
};
