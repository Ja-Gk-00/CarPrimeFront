// src/components/LoginForm.jsx

import React, { useState, useContext } from 'react';
import axios from 'axios';
import './LoginForm.css';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';

function LoginForm() {
  const { login } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = 'Invalid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const API_URL = 'https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/login';

      const response = await axios.post(API_URL, {
        email: formData.email,
        password: formData.password,
      });

      const userData = response.data.user;
      const token = response.data.token;

      try {
        toast.success('Logged in successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
      } catch (e) {}

      login(userData);
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        try {
          toast.error(`Login failed: ${error.response.data.message}`, {
            position: 'top-right',
            autoClose: 5000,
          });
        } catch (e) {}
      } else if (error.request) {
        try {
          toast.error('No response from the server. Please try again later.', {
            position: 'top-right',
            autoClose: 5000,
          });
        } catch (e) {}
      } else {
        try {
          toast.error(`Error: ${error.message}`, {
            position: 'top-right',
            autoClose: 5000,
          });
        } catch (e) {}
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">
          Email:
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </label>

        <label htmlFor="password">
          Password:
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Logging In...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
