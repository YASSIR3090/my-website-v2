import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Auth/Login.jsx';
import Register from './Auth/Register.jsx';
import Reset from './Auth/Reset.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import Applications from './Pages/Applications.jsx';
import Profile from './Pages/Profile.jsx';
import Jobs from './Pages/Jobs.jsx';
import AdminLogin from './admin/AdminLogin.jsx';
import AdminRegister from './admin/AdminRegister.jsx'; // 🔁 HERUFI NDOGO
import Management from './admin/Management.jsx';
import HomePage from './HomePage.jsx';

// API Base URL - IMPORTANT!
const API_BASE_URL = 'http://localhost:8000/api';

// Protected Route Component for regular users
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Protected Route Component for admin users
const AdminProtectedRoute = ({ children }) => {
  const isAdminAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
  return isAdminAuthenticated ? children : <Navigate to="/admin-login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login apiBaseUrl={API_BASE_URL} />} />
        <Route path="/register" element={<Register apiBaseUrl={API_BASE_URL} />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard apiBaseUrl={API_BASE_URL} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications" 
          element={
            <ProtectedRoute>
              <Applications apiBaseUrl={API_BASE_URL} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/jobs" 
          element={
            <ProtectedRoute>
              <Jobs apiBaseUrl={API_BASE_URL} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile apiBaseUrl={API_BASE_URL} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminProtectedRoute>
              <Management />
            </AdminProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;