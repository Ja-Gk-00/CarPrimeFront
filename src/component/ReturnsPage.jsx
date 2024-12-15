// src/components/ReturnsPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReturnsPage.css';
import CarReturnForm from './CarReturnForm';

function ReturnsPage() {
  const [rentedCars, setRentedCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedCar, setSelectedCar] = useState(null);
  const [showReturnForm, setShowReturnForm] = useState(false);

  useEffect(() => {
    fetchRentedCars();
  }, []);

  async function fetchRentedCars() {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/car/rented'); // Replace with your actual endpoint
      console.log('Rented Cars:', response.data);
      
      if (Array.isArray(response.data)) {
        const carsData = response.data.map((car) => ({
          id: car.id,
          brand: car.brand,
          model: car.name,
          year: car.year || 2020,
          properties: car.properties || ['Automatic', 'Petrol'],
          description: car.description || 'No description.',
          image: car.image || 'default_car.jpg',
          status: car.status || 'rented',

        }));
        setRentedCars(carsData);
      } else {
        setError('Invalid data format from API.');
      }
    } catch (err) {
      console.error('Error fetching rented cars:', err);
      if (err.response) {
        setError(`Error: ${err.response.status} - ${err.response.data}`);
      } else if (err.request) {
        setError('No response received from the server.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleReturnSuccess = (carId) => {
    setRentedCars(rentedCars.filter(car => car.id !== carId));
  };

  return (
    <div className="returns-container">
      <h1>Car Returns</h1>

      {loading ? (
        <div className="spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : rentedCars.length === 0 ? (
        <p>No rented cars at the moment.</p>
      ) : (
        <div className="rented-car-list">
          {rentedCars.map((car) => (
            <div key={car.id} className="rented-car-card">
              <img
                src={`${process.env.PUBLIC_URL}/images/${car.image}`}
                alt={`${car.brand} ${car.model}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
              <div className="car-details">
                <h2>{car.brand} {car.model} ({car.year})</h2>
                <p>{car.description}</p>
                <p>Features: {car.properties.join(', ')}</p>
                <button
                  onClick={() => {
                    setSelectedCar(car);
                    setShowReturnForm(true);
                  }}
                >
                  Return Car
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showReturnForm && selectedCar && (
        <CarReturnForm
          car={selectedCar}
          onClose={() => setShowReturnForm(false)}
          returnCar={handleReturnSuccess}
        />
      )}
    </div>
  );
}

export default ReturnsPage;
