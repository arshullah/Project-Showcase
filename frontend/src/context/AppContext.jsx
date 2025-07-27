'use client';

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    const id = localStorage.getItem('userId');
    
    if (token) {
      setAuthToken(token);
    }
    if (role) {
      setUserRole(role);
    }
    if (id) {
      setUserId(id);
    }
    
    // Mark as loaded after checking localStorage
    setIsLoaded(true);
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setAuthToken(null);
    setUserRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, userRole, userId, isLoaded, setAuthToken, setUserRole, setUserId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;