import { createContext, useEffect, useState } from "react";
import axios from "axios";

const AppContext = createContext();

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeCSRF();
    checkAuth();
  }, []);

  const initializeCSRF = async () => {
    await axios.get("http://localhost:5000/sanctum/csrf-cookie");
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get("/user");
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      await initializeCSRF();
      const response = await axios.post("/login", { email, password });
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      await checkAuth();
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  const register = async (name, email, password) => {
    try {
      await initializeCSRF();
      await axios.post("/register", { name, email, password });
      await login(email, password);
    } catch (error) {
      throw new Error("Registration failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post("/logout");
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed");
    }
  };

  return (
    <AppContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;