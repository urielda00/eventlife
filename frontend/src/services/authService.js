import axios from "axios";

// Base API instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------ Auth Service Functions ------------------ //

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await API.post("/users/login", credentials);
    const { success, resBody, message } = response.data;

    if (success && resBody?.token) {
      localStorage.setItem("token", resBody.token);
      localStorage.setItem("user", JSON.stringify(resBody.user));
      localStorage.setItem("token_created_at", Date.now());

      return { success: true, data: { user: resBody.user, token: resBody.token } };
    }
    return { success: false, error: message || "Login failed" };
  } catch (err) {
    return { success: false, error: err.message || "Login error" };
  }
};

// Register user
export const registerUser = async (details) => {
  try {
    const response = await API.post("/users/register", details);
    const { success, resBody, message } = response.data;

    if (success && resBody?.token) {
      localStorage.setItem("token", resBody.token);
      localStorage.setItem("user", JSON.stringify(resBody.user));
      localStorage.setItem("token_created_at", Date.now());

      return { success: true, data: { user: resBody.user, token: resBody.token } };
    }
    return { success: false, error: message || "Registration failed" };
  } catch (err) {
    return { success: false, error: err.message || "Registration error" };
  }
};

// Logout user (clear localStorage)
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("token_created_at");
  localStorage.removeItem("user");
};

// Check if token is still valid (10 minutes for now)
export const isTokenValid = () => {
  const created = localStorage.getItem("token_created_at");
  if (!created) return false;

  const age = Date.now() - parseInt(created, 10);
  return age < 10 * 60 * 1000; // 10 minutes in ms
};

// Get current user from localStorage
export const getCurrentUser = async () => {
  try {
    if (!isTokenValid()) return { success: false, error: "Token expired or missing" };
    const user = localStorage.getItem("user");
    return { success: true, data: user ? JSON.parse(user) : null };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await API.get("/users");
    return { success: true, data: response.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await API.get(`/users/${id}`);
    return { success: true, data: response.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Delete user
export const deleteUser = async (credentials) => {
  try {
    const response = await API.delete("/users", { data: credentials });
    return { success: true, data: response.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};