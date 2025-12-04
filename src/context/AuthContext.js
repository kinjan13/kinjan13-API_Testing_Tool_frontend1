import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }

    if (savedToken) {
      setToken(savedToken);
    }
    // eslint-disable-next-line no-console
    console.log("AuthProvider initialized", { savedUser: !!savedUser, savedToken: !!savedToken });
  }, []);

  // Set axios baseURL so dev proxy is used (relative URLs), production will use REACT_APP_API_URL
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      axios.defaults.baseURL = ""; // use relative paths; create-react-app proxy will forward
    } else {
      axios.defaults.baseURL = process.env.REACT_APP_API_URL || "";
    }
  }, []);

  // Keep axios default Authorization header in sync with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    // eslint-disable-next-line no-console
    console.log("Auth login", { user: userData?.email || userData, token: !!token });
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // eslint-disable-next-line no-console
    console.log("Auth logout: cleared user and token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
