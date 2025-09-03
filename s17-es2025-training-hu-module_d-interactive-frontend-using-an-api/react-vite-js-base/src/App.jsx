import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import "./css/general.css";

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Mentors from './pages/Mentors';
import BookedSessions from './pages/BookedSessions';
import { useState } from 'react';
import AppContext from './contexts/AppContext';
import { authApi } from './api/api';

function App() {
  const [userData, setUserData] = useState();

  const getUser = async () => {
    try {
      const { data } = await authApi.me();
      setUserData(data)
    } catch (err) {
      logout();
    }
  };

  async function logout() {
    try {
      await authApi.logout();
    } catch (err) {
      console.error(err);
    }

    localStorage.removeItem("token");
    location.href = "/login";
  }

  return (
    <AppContext.Provider value={{ userData, setUserData, getUser, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:id" element={<CourseDetails />} />
                    <Route path="/mentors" element={<Mentors />} />
                    <Route path="/booked-sessions" element={<BookedSessions />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;