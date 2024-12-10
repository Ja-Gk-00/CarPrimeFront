// src/HomePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/HomePage.css';
import CarRentalForm from './CarReturnForm'; // Assuming the form is used for both renting and returning

function HomePage() {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 5;
  const [selectedCar, setSelectedCar] = useState(null);
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAvailableCars();
    fetchCarProperties();
  }, []);

  function fetchAvailableCars() {
    setLoading(true);
    axios
      .get('https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/car')
      .then((response) => {
        if (Array.isArray(response.data)) {
          const carsData = response.data
            .map((car) => ({
              id: car.id,
              brand: car.brand,
              model: car.name,
              year: car.year || 2020,
              properties: car.properties || ['Automatic', 'Petrol'],
              description: car.description || 'No description.',
              image: car.image || 'default_car.jpg',
              status: car.status || 'available',
            }))
            .filter((car) => car.status === 'available');
          setCars(carsData);
          setFilteredCars(carsData);
        } else {
          setError('Invalid data format from API.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch car data.');
        setLoading(false);
      });
  }

  function fetchCarProperties() {
    const sampleProperties = [
      'Automatic',
      'Manual',
      'Petrol',
      'Diesel',
      'Hybrid',
      'Electric',
      'Sedan',
      'Wagon',
      'Hatchback',
      'SUV',
      'Premium',
    ];
    setProperties(sampleProperties);
  }

  function handleSearch() {
    const trimmedBrand = brand.trim().toLowerCase();
    const trimmedModel = model.trim().toLowerCase();

    let results = cars.filter((car) => {
      const brandMatch =
        trimmedBrand === '' ||
        (car.brand && car.brand.toLowerCase().includes(trimmedBrand));
      const modelMatch =
        trimmedModel === '' ||
        (car.model && car.model.toLowerCase().includes(trimmedModel));
      return brandMatch && modelMatch;
    });

    if (selectedProperties.length > 0) {
      results = results.filter((car) =>
        selectedProperties.every((prop) => car.properties.includes(prop))
      );
    }

    setFilteredCars(results);
    setCurrentPage(1);
  }

  function handlePropertyChange(property) {
    if (selectedProperties.includes(property)) {
      setSelectedProperties(selectedProperties.filter((p) => p !== property));
    } else {
      setSelectedProperties([...selectedProperties, property]);
    }
  }

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProperties]);

  function paginateCars() {
    const lastCarIndex = currentPage * carsPerPage;
    const firstCarIndex = lastCarIndex - carsPerPage;
    return filteredCars.slice(firstCarIndex, lastCarIndex);
  }

  function renderPagination() {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredCars.length / carsPerPage); i++) {
      pageNumbers.push(i);
    }
    return pageNumbers.map((number) => (
      <button
        key={number}
        onClick={() => setCurrentPage(number)}
        className={number === currentPage ? 'active' : ''}
      >
        {number}
      </button>
    ));
  }

  function rentCar(carId, customerData) {
    axios
      .post(`https://carprimeapi-cddtdnh9bbdqgzex.polandcentral-01.azurewebsites.net/car/${carId}/rent`, customerData)
      .then(() => {
        alert('Car has been successfully rented!');
        fetchAvailableCars();
        setShowRentalForm(false);
      })
      .catch(() => {
        alert('There was a problem renting the car.');
      });
  }

  return (
    <div className="container">
      <h1>Car Rental Service</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="filters">
        {properties.map((property) => (
          <label key={property}>
            <input
              type="checkbox"
              value={property}
              checked={selectedProperties.includes(property)}
              onChange={() => handlePropertyChange(property)}
            />
            {property}
          </label>
        ))}
      </div>

      {loading ? (
        <div className="spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="car-list">
          {paginateCars().map((car) => (
            <div key={car.id} className="car-card">
              <img
                src={`/images/${car.image}`}
                alt={`${car.brand} ${car.model}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
              <h2>
                {car.brand} {car.model} ({car.year})
              </h2>
              <p>{car.description}</p>
              <p>Features: {car.properties.join(', ')}</p>
              <button
                onClick={() => {
                  setSelectedCar(car);
                  setShowRentalForm(true);
                }}
              >
                Rent
              </button>
            </div>
          ))}
          {filteredCars.length === 0 && <p>No available cars.</p>}
        </div>
      )}

      {!loading && !error && filteredCars.length > 0 && (
        <div className="pagination">{renderPagination()}</div>
      )}

      {showRentalForm && selectedCar && (
        <CarRentalForm
          car={selectedCar}
          onClose={() => setShowRentalForm(false)}
          rentCar={rentCar}
        />
      )}
    </div>
  );
}

export default HomePage;