// src/context/AuthContext.jsx
import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getCurrentUser,
  isTokenValid,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authService";

/**
 * Auth Context
 * - Manages user state and token lifecycle
 * - Initializes from localStorage if token is still valid
 * - Exposes { user, loading, login, register, logout, refresh }
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // full user object {id, username, email, name, phone}
  const [loading, setLoading] = useState(true); // true while initializing
  const navigate = useNavigate();

  // Initialize auth state once on mount
  useEffect(() => {
    const init = async () => {
      try {
        if (isTokenValid()) {
          const result = await getCurrentUser();
          if (result.success) {
            setUser(result.data);
          } else {
            logoutUser();
            setUser(null);
          }
        } else {
          logoutUser();
          setUser(null);
        }
      } catch (err) {
        console.error("Auth init error:", err);
        logoutUser();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Called after successful login
  const login = async (credentials) => {
    setLoading(true);
    const result = await loginUser(credentials);
    if (result.success) {
      setUser(result.data.user);
    }
    setLoading(false);
    return result;
  };

  // Register user then log in
  const register = async (details) => {
    setLoading(true);
    const result = await registerUser(details);
    if (result.success) {
      setUser(result.data.user);
    }
    setLoading(false);
    return result;
  };

  // Clear token + user and reset state, then redirect to home
  const logout = () => {
    setLoading(true);
    logoutUser();
    setUser(null);
    setLoading(false);
    navigate("/");
  };

  // Re-check token and rehydrate user from localStorage
  const refresh = async () => {
    setLoading(true);
    try {
      if (isTokenValid()) {
        const result = await getCurrentUser();
        if (result.success) {
          setUser(result.data);
          setLoading(false);
          return true;
        }
      }
      logoutUser();
      setUser(null);
      setLoading(false);
      navigate("/");
      return false;
    } catch (err) {
      console.error("Auth refresh error:", err);
      logoutUser();
      setUser(null);
      setLoading(false);
      navigate("/");
      return false;
    }
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};