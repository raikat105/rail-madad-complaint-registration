import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get('http://localhost:4001/api/users/profile', { withCredentials: true });
        setProfile(data.user);
        setIsAuthenticated(true);
        // Store profile data in localStorage for persistence
        localStorage.setItem('profile', JSON.stringify(data.user));
      } catch (error) {
        console.log('Not authenticated');
        setIsAuthenticated(false);
        localStorage.removeItem('profile');
      }
    };

    const storedProfile = localStorage.getItem('profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
      setIsAuthenticated(true);
    } else {
      checkAuth();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ profile, isAuthenticated, setIsAuthenticated, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
