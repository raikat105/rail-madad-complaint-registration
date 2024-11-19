import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
const [profile, setProfile] = useState();
const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("token");
        const parsedToken = token ? JSON.parse(token) : undefined;
        if (parsedToken) {
          const { data } = await axios.get(
            "http://localhost:4001/api/users/my-profile",
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );
          console.log(data);
          setProfile(data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        profile,
        setProfile,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
