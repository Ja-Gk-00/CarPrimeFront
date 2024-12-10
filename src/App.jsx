// src/App.jsx
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import HomePage from './HomePage';
import ReturnsPage from './ReturnsPage';
import LoginPage from './LoginPage';
import ProtectedRoute from './ProtectedRoute';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/returns" 
            element={
              <ProtectedRoute>
                <ReturnsPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<LoginPage />} />
          {/*  */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <h1>Car Rental Service</h1>
      <ul>
        {isAuthenticated && (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/returns">Returns</Link>
            </li>
          </>
        )}
        {!isAuthenticated ? (
          <li>
            <Link to="/login">Login</Link>
          </li>
        ) : (
          <li>
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default App;
