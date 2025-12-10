import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios'; // This imports your configured Axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for an existing user session
    const storedUser = localStorage.getItem('foodshare_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user", e);
        localStorage.removeItem('foodshare_user');
      }
    }
    setLoading(false);
  }, []);

  // REAL LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      // 1. Send credentials to the backend
      const { data } = await api.post('/auth/login', { email, password });
      
      // 2. Save the real user data (including the valid token)
      setUser(data);
      localStorage.setItem('foodshare_user', JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
      throw error; // Let the UI handle the error message
    }
  };

  // REAL REGISTER FUNCTION
  const register = async (userData) => {
    try {
      // 1. Send registration data to the backend
      const { data } = await api.post('/auth/register', userData);
      
      // 2. Save the new user data
      setUser(data);
      localStorage.setItem('foodshare_user', JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('foodshare_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);