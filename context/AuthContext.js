"use client";

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isLoggedIn: false, role: null });

  const updateAuth = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setAuth({ isLoggedIn: true, role: decoded.role });
      } catch (err) {
        setAuth({ isLoggedIn: false, role: null });
      }
    } else {
      setAuth({ isLoggedIn: false, role: null });
    }
  };

  useEffect(() => {
    updateAuth();
    window.addEventListener("storage", updateAuth);
    return () => window.removeEventListener("storage", updateAuth);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
};