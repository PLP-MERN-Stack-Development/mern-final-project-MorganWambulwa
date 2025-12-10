import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Points to your Node/Express backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('foodshare_user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;