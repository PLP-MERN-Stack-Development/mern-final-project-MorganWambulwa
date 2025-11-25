import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
});

// Auth token injection
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("foodshare_user"));
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});
