import React from "react"
import './footer.css'

function Footer() {
    return (
        <div className="footer-container">
            <div className="footer-content">
                <div className="footer-logo">
                    <h3>Campsite Booking</h3>
                    <p className="tagline">Your adventure awaits in nature</p>
                </div>
                
                <div className="footer-info">
                    <p>&copy; 2025 Campsite Booking. All rights reserved.</p>
                    <div className="contact-info">
                        <p><i className="fas fa-envelope"></i> contact@campsitebooking.com</p>
                        <p><i className="fas fa-phone"></i> +123 456 7890</p>
                    </div>
                </div>
                
                <div className="footer-cta">
                    <button className="review-button">
                        <span>Leave a Review</span>
                        <i className="fas fa-star"></i>
                    </button>
                    <div className="payment-methods">
                        <span>We accept:</span>
                        <div className="payment-icons">
                            <i className="fab fa-cc-visa"></i>
                            <i className="fab fa-cc-mastercard"></i>
                            <i className="fab fa-cc-paypal"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer