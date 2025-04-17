import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="thank-you-container">
      <h2>Thank You for Your Booking!</h2>
      <p>Your booking has been confirmed. We hope you enjoy your stay!</p>
      <button onClick={() => navigate("/")}>Go to Homepage</button>
    </div>
  );
};

export default ThankYou;
