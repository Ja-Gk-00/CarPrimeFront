// src/components/RegistrationForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegistrationForm({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = 'Invalid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
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
      const API_URL = 'https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/register';

      const response = await axios.post(API_URL, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success('Registration successful! You can now log in.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });

      setTimeout(() => {
        onSwitchToLogin();
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        toast.error(`Registration failed: ${error.response.data.message}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
      } else if (error.request) {
        toast.error('No response from the server. Please try again later.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
      } else {
        toast.error(`Error: ${error.message}`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registration-form-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="name">
          Name:
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </label>

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
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </label>

        <label htmlFor="confirmPassword">
          Confirm Password:
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p>
        Already have an account?{' '}
        <button className="switch-button" onClick={onSwitchToLogin}>
          Log In
        </button>
      </p>
    </div>
  );
}

export default RegistrationForm;
