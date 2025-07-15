import axios from 'axios';

const API = axios.create({
  baseURL: 'https://localhost:7203/api', 
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export const loginUser = (data) => {
  return API.post('/Authentication/login', {
    UserName: data.userName,
    Password: data.password
  });
};

export const registerUser = (data) => API.post('/Authentication/register', data);
export default API;