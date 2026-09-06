import axios from "axios";

// Create base instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: add token header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;