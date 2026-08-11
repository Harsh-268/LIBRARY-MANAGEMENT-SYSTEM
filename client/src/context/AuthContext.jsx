import React, { useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); 

 
  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get("/users/current-user");
      setUser(response.data.data);
      setStatus("authenticated");
    } catch (error) {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const response = await api.post("/users/login", { email, password });
      setUser(response.data.data.user);
      setStatus("authenticated");
      return {
        success: true,
        message: "User has been successfully logged in",
        user: response.data.data.user,
      };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Invalid Credentials" };
    }
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  };

  return (
    <AuthContext.Provider value={{ user, status, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export { AuthProvider, AuthContext, useAuth };