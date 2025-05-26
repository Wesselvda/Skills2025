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

  const [adminData, setAdminData] = useState();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeCSRF();
    checkAuth();
  }, []);

  async function initializeCSRF() {
    await axios.get("http://localhost:5000/sanctum/csrf-cookie");
  };

  async function checkAuth() {
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

  async function getAdminData() {
    try {
      const response = await axios.get("/admin/getdata");
      setAdminData(response.data);
    } catch (error) {
      setAdminData(null);
      localStorage.removeItem("admin-token");
    } finally {
      setLoading(false);
    }
  };

  async function login(email, password) {
    try {
      await initializeCSRF();
      const response = await axios.post("/login", { email, password });
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      await checkAuth();
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  async function adminLogin(username, password) {
    try {
      await initializeCSRF();
      const response = await axios.post("/admin/login", { username, password });
      axios.defaults.headers.common["X-Admin-Token"] = response.data.token;
      localStorage.setItem('admin-token', response.data.token);
      return true
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  async function adminLogout() {
    localStorage.removeItem('admin-token');
  }

  async function register(name, email, password) {
    try {
      await initializeCSRF();
      await axios.post("/register", { name, email, password });
      await login(email, password);
    } catch (error) {
      throw new Error("Registration failed");
    }
  };

  async function logout() {
    try {
      await axios.post("/logout");
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed");
    }
  };

  function adminHandleDeactivate(userId) {
    if (!window.confirm("Are you sure you want to deactivate this user?")) return;

    axios.post(`/admin/user/${userId}/deactivate`, null, {
      headers: {
        'X-Admin-Token': localStorage.getItem('admin-token')
      }
    })
      .then(() => {
        getAdminData();
      })
      .catch(err => {
        console.error("Failed to deactivate user", err);
      });
  }

  function adminHandleAnonymize(userId) {
    if (!window.confirm("Are you sure you want to anonymize this user? This cannot be undone.")) return;

    axios.post(`/admin/user/${userId}/anonymize`, null, {
      headers: {
        'X-Admin-Token': localStorage.getItem('admin-token')
      }
    })
      .then(() => {
        getAdminData();
      })
      .catch(err => {
        console.error("Failed to anonymize user", err);
      });
  }

  async function adminToggleGameActive(gameId, active) {
    try {
      await axios.post(`/admin/game/${gameId}/toggle`, { active }, {
        headers: {
          'X-Admin-Token': localStorage.getItem('admin-token'),
        },
      });
      await getAdminData();
    } catch (error) {
      console.error("Failed to update game status", error);
    }
  }

  async function adminReorderGames(gameIds) {
    try {
      await axios.post('/admin/games/reorder', { game_ids: gameIds }, {
        headers: {
          'X-Admin-Token': localStorage.getItem('admin-token'),
        }
      });
      await getAdminData();
    } catch (err) {
      console.error("Failed to reorder games", err);
    }
  }

  async function adminAddGame({ title, subtitle, credit_cost, image }) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('credit_cost', credit_cost);
    formData.append('image', image);

    try {
      await axios.post('/admin/games', formData, {
        headers: {
          'X-Admin-Token': localStorage.getItem('admin-token'),
          'Content-Type': 'multipart/form-data',
        }
      });
      await getAdminData();
    } catch (error) {
      console.error("Failed to add game", error);
      throw error;
    }
  }

  async function adminEditGame(gameId, { title, subtitle, credit_cost, image }) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('credit_cost', credit_cost);
    if (image) formData.append('image', image);

    try {
      await axios.post(`/admin/games/${gameId}/edit`, formData, {
        headers: {
          'X-Admin-Token': localStorage.getItem('admin-token'),
          'Content-Type': 'multipart/form-data',
        }
      });
      await getAdminData();
    } catch (error) {
      console.error("Failed to edit game", error);
      throw error;
    }
  }

  return (
    <AppContext.Provider value={{ user, loading, login, register, logout, checkAuth, adminLogin, adminLogout, adminData, getAdminData, adminHandleDeactivate, adminHandleAnonymize, adminToggleGameActive, adminReorderGames, adminAddGame, adminEditGame }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;