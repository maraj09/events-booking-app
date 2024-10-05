"use client";
import React, { useContext, useEffect, useState } from "react";
import axios from "./axios";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let tokenResponse = await fetch(`/api/auth-token`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (tokenResponse.ok) {
          const data = await tokenResponse.json();
          if (data.success) {
            const response = await axios.get(`/api/user`, {
              headers: {
                Authorization: `Bearer ${data.token.value}`,
              },
            });

            setAuthToken(data.token.value);
            setUser(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error.response || error.message);
        return null;
      }
    };

    fetchUser();
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, authToken, setAuthToken }}>
      {children}
    </AppContext.Provider>
  );
};
export const useAppContext = () => {
  return useContext(AppContext);
};
export { AppContext, AppProvider };
