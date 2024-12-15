// src/components/CarRentalForm.jsx

import React, { useState } from 'react';
import './CarRentalForm.css'; 

function CarRentalForm({ car, onClose, rentCar }) {
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
  });

  const handleChange = (e) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    rentCar(car.id, customerData);
  };

  return (
    <div className="car-rental-form-overlay">
      <div className="car-rental-form">
        <h2>Rent {car.brand} {car.model}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={customerData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={customerData.email}
              onChange={handleChange}
              required
            />
          </label>
          {/* */}
          <div className="form-buttons">
            <button type="submit">Submit Rental</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CarRentalForm;
