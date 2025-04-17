// components/CampsiteDetails.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './Camps.css';

const CampsiteDetails = () => {
  const { id } = useParams();
  const [campsite, setCampsite] = useState(null);
  const [guests, setGuests] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const user = JSON.parse(localStorage.getItem("Users"));
  const userId = user ? user._id : null;

  useEffect(() => {
    const fetchCampsiteDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/campsite/CampsiteDetails/${id}`);
        setCampsite(response.data);
      } catch (error) {
        console.error("Error fetching campsite details:", error);
        setError("Failed to load campsite details");
      } finally {
        setLoading(false);
      }
    };

    fetchCampsiteDetails();
  }, [id]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const numberOfDays = (end - start) / (1000 * 3600 * 24);
      const total = parseFloat(campsite?.amount.$numberDecimal || 0) * numberOfDays;
      setTotalPrice(total.toFixed(2));
    }
  }, [startDate, endDate, campsite]);

  if (loading) {
    return <div className="loading-container">Loading campsite details...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!campsite) {
    return <div className="not-found-container">Campsite not found</div>;
  }

  const imageUrls = campsite.image.map(img => `http://localhost:9000${img}`);
  const today = new Date().toISOString().split("T")[0];

  const handleAddToCart = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
  
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      alert("End date must be after the start date.");
      return;
    }
  
    try {
      const availabilityResponse = await axios.post("http://localhost:9000/cart/checkAvailability", {
        campsite_id: campsite._id,
        start_date: startDate,
        end_date: endDate
      });
  
      if (!availabilityResponse.data.available) {
        alert("The selected dates are not available for booking. Please choose different dates.");
        return;
      }
  
      const numberOfDays = (end - start) / (1000 * 3600 * 24);
      const totalAmount = parseFloat(campsite.amount.$numberDecimal) * numberOfDays;
  
      const bookingData = {
        user_id: userId,
        campsite_id: campsite._id,
        number_of_days: numberOfDays,
        guests,
        start_date: startDate,
        end_date: endDate,
        total_amount: totalAmount,
        payment_status: "Unpaid",
      };
  
      const response = await axios.post("http://localhost:9000/cart/add", bookingData);
  
      if (response.status === 201) {
        alert("Campsite booked successfully!");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert(error.response?.data?.message || "Error booking campsite. Please try again.");
    }
  };

  return (
    <div className="campsite-details-container">
      <div className="campsite-header">
        <h1 className="campsite-title">{campsite.campsite_name}</h1>
        <div className="campsite-location">
          <i className="fas fa-map-marker-alt"></i>
          <span>{campsite.address}, {campsite.city}, {campsite.state}</span>
          {campsite.country_id && (
            <span className="country-flag">🇺🇸</span> // Replace with actual flag logic
          )}
        </div>
      </div>

      <div className="campsite-gallery">
        {imageUrls.map((url, index) => (
          <div key={index} className="gallery-item">
            <img src={url} alt={`Campsite view ${index + 1}`} />
          </div>
        ))}
      </div>

      <div className="campsite-content">
        <div className="campsite-description">
          <h2>About this campsite</h2>
          <p>{campsite.description}</p>
          
          <div className="amenities-section">
            <h3>Amenities</h3>
            <div className="amenities-grid">
              <div className="amenity-item">
                <i className="fas fa-fire"></i>
                <span>Campfire allowed</span>
              </div>
              <div className="amenity-item">
                <i className="fas fa-toilet"></i>
                <span>Restrooms</span>
              </div>
              <div className="amenity-item">
                <i className="fas fa-shower"></i>
                <span>Showers</span>
              </div>
              <div className="amenity-item">
                <i className="fas fa-car"></i>
                <span>Parking</span>
              </div>
            </div>
          </div>
        </div>

        <div className="booking-card">
          <div className="booking-card-header">
            <h3>Book your stay</h3>
            <div className="price-per-night">
              ${campsite.amount.$numberDecimal} <span>/ night</span>
            </div>
          </div>

          <div className="booking-form">
            <div className="form-group">
              <label htmlFor="startDate">Check-in</label>
              <div className="input-with-icon">
                {/* <i className="far fa-calendar-alt"></i> */}
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="endDate">Check-out</label>
              <div className="input-with-icon">
                {/* <i className="far fa-calendar-alt"></i> */}
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="guests">Guests</label>
              <div className="input-with-icon">
                {/* <i className="fas fa-user-friends"></i> */}
                <input
                  id="guests"
                  type="number"
                  value={guests}
                  min="1"
                  onChange={(e) => setGuests(Number(e.target.value))}
                />
              </div>
            </div>

            {totalPrice > 0 && (
              <div className="price-summary">
                <div className="price-row">
                  <span>${campsite.amount.$numberDecimal} x {Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24))} nights</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            )}

            <button className="book-now-btn" onClick={handleAddToCart}>
              Book Now
            </button>

            <div className="booking-note">
              <i className="fas fa-info-circle"></i>
              <span>You won't be charged yet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampsiteDetails;