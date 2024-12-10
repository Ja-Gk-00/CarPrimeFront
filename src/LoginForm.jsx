// src/LoginForm.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import './styles/LoginForm.css';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);
  console.log('LoginForm AuthContext:', authContext);
  
  if (!authContext) {
    console.error('AuthContext is undefined');
  }

  const { login } = authContext || {};
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    if (login) {
      login();
      navigate('/');
    } else {
      console.error('login function is not available');
    }
  }

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <label>
          Email:
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="Enter your email" 
          />
        </label>
        <label>
          Password:
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="Enter your password" 
          />
        </label>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
