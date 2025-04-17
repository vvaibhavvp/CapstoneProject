import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import './Camps.css';

const CampsiteList = () => {
  const [campsites, setCampsites] = useState([]);
  const [filteredCampsites, setFilteredCampsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    priceRange: { min: 0, max: 1000 },
    availability: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchCampsites = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:9000/campsite/campsiteList");
        setCampsites(response.data);
        setFilteredCampsites(response.data);
      } catch (error) {
        console.error("Error fetching campsites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampsites();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let result = campsites;

      if (filters.location) {
        result = result.filter(campsite =>
          campsite.address && campsite.address.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      result = result.filter(campsite =>
        parseFloat(campsite.amount.$numberDecimal) >= filters.priceRange.min &&
        parseFloat(campsite.amount.$numberDecimal) <= filters.priceRange.max
      );

      if (filters.availability) {
        result = result.filter(campsite =>
          campsite.availability && campsite.availability.toLowerCase() === filters.availability.toLowerCase()
        );
      }

      if (filters.startDate && filters.endDate) {
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        result = result.filter(campsite => {
          const campsiteStartDate = new Date(campsite.start_date);
          const campsiteEndDate = new Date(campsite.end_date);
          return (startDate <= campsiteEndDate && endDate >= campsiteStartDate);
        });
      }

      setFilteredCampsites(result);
    };

    applyFilters();
  }, [filters, campsites]);

  const clearFilters = () => {
    setFilters({
      location: '',
      priceRange: { min: 0, max: 1000 },
      availability: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="campsite-list-container">
      <div className="campsite-header">
        <h2 className="section-title">Discover Your Perfect Campsite</h2>
        <p className="section-subtitle">Browse through our curated selection of beautiful camping locations</p>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
  <div className="filter-grid">
    {/* Location Filter */}
    <div className="filter-group">
      <label className="filter-label">Location</label>
      <input
        type="text"
        placeholder="City, state, or country"
        className="filter-input"
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
      />
    </div>

    {/* Price Range Filter */}
    <div className="filter-group">
      <label className="filter-label">Price Range</label>
      <div className="price-range-inputs">
        <input
          type="number"
          placeholder="Min"
          className="filter-input"
          min="0"
          value={filters.priceRange.min}
          onChange={(e) => setFilters({ ...filters, priceRange: { ...filters.priceRange, min: e.target.value } })}
        />
        <span className="price-range-separator">to</span>
        <input
          type="number"
          placeholder="Max"
          className="filter-input"
          min={filters.priceRange.min}
          value={filters.priceRange.max}
          onChange={(e) => setFilters({ ...filters, priceRange: { ...filters.priceRange, max: e.target.value } })}
        />
      </div>
    </div>

    {/* Availability Filter */}
    <div className="filter-group">
      <label className="filter-label">Availability</label>
      <select
        className="filter-select"
        value={filters.availability}
        onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
      >
        <option value="">All Statuses</option>
        <option value="Available">Available</option>
        <option value="Fully Booked">Fully Booked</option>
        <option value="Seasonal">Seasonal</option>
      </select>
    </div>

    {/* Date Filter */}
    <div className="filter-group">
      <label className="filter-label">Dates</label>
      <div className="date-inputs">
        <input
          type="date"
          className="filter-date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        />
        <span className="date-separator">to</span>
        <input
          type="date"
          className="filter-date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
      </div>
    </div>

    {/* Clear Filters Button - Now properly placed below */}
    <div className="clear-filters-container">
      <button className="clear-filters-btn" onClick={clearFilters}>
        <i className="fas fa-times"></i> Clear Filters
      </button>
    </div>
  </div>
</div>


      {/* Results Count */}
      <div className="results-count">
        {filteredCampsites.length} {filteredCampsites.length === 1 ? 'campsite' : 'campsites'} found
      </div>

      {/* Campsite Cards */}
      {loading ? (
        <div className="loading-spinner">Loading campsites...</div>
      ) : (
        <div className="campsite-grid">
          {filteredCampsites.length > 0 ? (
            filteredCampsites.map((campsite) => {
              const imageUrl = `http://localhost:9000${campsite.image[0]}`;
              const price = parseFloat(campsite.amount.$numberDecimal).toFixed(2);
              
              return (
                <div className="campsite-card" key={campsite._id}>
                  <Link to={`/campsite/campsiteDetails/${campsite._id}`} className="card-link">
                    <div className="card-image-container">
                      <img
                        src={imageUrl}
                        alt={campsite.campsite_name}
                        className="campsite-image"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80';
                        }}
                      />
                      <div className="card-badge">
                        {campsite.availability || 'Available'}
                      </div>
                    </div>
                    <div className="card-content">
                      <h3 className="campsite-name">{campsite.campsite_name}</h3>
                      <p className="campsite-location">
                        <i className="fas fa-map-marker-alt"></i> {campsite.address}
                      </p>
                      <div className="card-footer">
                        <span className="campsite-price">${price} <span className="price-night">/ night</span></span>
                        <button className="view-details-btn">View Details</button>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="no-results">
              <h3>No campsites match your filters</h3>
              <p>Try adjusting your search criteria or clear all filters</p>
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CampsiteList;