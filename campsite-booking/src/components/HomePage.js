import React, { useEffect } from "react";
import "../styles.css";
import Navbar from "./Navbar";


const HomePage = () => {
  // Animation effect for cards on scroll
  useEffect(() => {
    const cards = document.querySelectorAll('.card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
      card.classList.add('card-hidden');
      observer.observe(card);
    });
    
    return () => {
      cards.forEach(card => observer.unobserve(card));
    };
  }, []);

  return (
    <div className="home">
      {/* Hero Section with animated text */}
      <div className="hero">
        <h1>Experience the Best Campsite Booking</h1>
        <p>Find the perfect getaway for your adventure in nature's paradise</p>
      </div>

      <h1 className="main-title">Discover Your Perfect Campsite</h1>
      
      {/* Enhanced Search Section */}
      <div className="search-section">
        <input type="text" placeholder="Where you're staying?" />
        <input type="date" placeholder="Check-in" />
        <input type="date" placeholder="Check-out" />
        <input type="number" placeholder="Number of adults" min="1" defaultValue="1" />
        <input type="number" placeholder="Number of children" min="0" defaultValue="0" />
        <input type="number" placeholder="Number of tents" min="1" defaultValue="1" />
        <button className="search-button">Find Campsites</button>
      </div>
      
      {/* Special Offers Section */}
      <div className="offers">
        <h2>Special Offers</h2>
        <p>Explore great deals and discounts for your next outdoor adventure. Book now and save up to 25% on selected destinations!</p>
        <button className="offer-button">View Offers</button>
      </div>
      
      {/* Explore Locations Section */}
      <div className="explore">
        <h2>Explore Locations</h2>
        <div className="location-cards">
          <div className="card">
            <div className="card-badge">Popular</div>
            <img src="images/canada.jpg" alt="Canada" />
            <div className="card-content">
              <h3>Canada</h3>
              <p>200+ campsites</p>
            </div>
          </div>
          <div className="card">
            <div className="card-badge">Featured</div>
            <img src="/images/usa.jpg" alt="USA" />
            <div className="card-content">
              <h3>USA</h3>
              <p>350+ campsites</p>
            </div>
          </div>
          <div className="card">
          <div className="card-badge">Featured</div>
            <img src="/images/india.jpg" alt="India" />
            <div className="card-content">
              <h3>India</h3>
              <p>120+ campsites</p>
            </div>
          </div>
          <div className="card">
            <div className="card-badge">New</div>
            <img src="/images/mexico.jpg" alt="Mexico" />
            <div className="card-content">
              <h3>Mexico</h3>
              <p>95+ campsites</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Activities Section with enhanced cards */}
      <div className="activities">
        <h2>Popular Activities</h2>
        <div className="activity-cards">
          <div className="card">
            <img src="/images/hiking.jpg" alt="Hiking" />
            <div className="card-content">
              <h3>Hiking Adventures</h3>
              <p>Explore beautiful trails.</p>
            </div>
          </div>
          <div className="card">
            <img src="/images/canoeing.jpg" alt="Canoeing" />
            <div className="card-content">
              <h3>Kayaking</h3>
              <p>lakes and rivers surrounded by natural beauty.</p>
            </div>
          </div>
          <div className="card">
            <img src="/images/campfire.jpg" alt="Campfire Nights" />
            <div className="card-content">
              <h3>Campfire Nights</h3>
              <p>Stargazing and storytelling under the clear night sky.</p>
            </div>
          </div>
          <div className="card">
            <img src="/images/fishing.jpg" alt="Fishing" />
            <div className="card-content">
              <h3>Fishing</h3>
              <p>Relax and catch fresh fish with expert guides.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials Section - New */}
      <div className="testimonials">
        <h2>What Campers Say</h2>
        <div className="testimonial-container">
          <div className="testimonial">
            <div className="quote">"The most beautiful camping experience we've ever had. The booking was seamless and the campsite was exactly as described!"</div>
            <div className="author">- Sarah J., Canada</div>
          </div>
          <div className="testimonial">
            <div className="quote">"Great service and amazing locations. We found the perfect spot for our family reunion thanks to this site."</div>
            <div className="author">- Michael T., USA</div>
          </div>
          <div className="testimonial">
            <div className="quote">"The easiest booking process for camping I've ever experienced. Will definitely use again for our next adventure!"</div>
            <div className="author">- Elena R., Mexico</div>
          </div>
        </div>
      </div>
      
      {/* Newsletter Section - New */}
      <div className="newsletter">
        <h2>Stay Updated</h2>
        <p>Subscribe to our newsletter for exclusive offers and camping tips</p>
        <div className="newsletter-form">
          <button>Subscribe</button>
        </div>
      </div>
      
      {/* <Navbar /> */}
    </div>
  );
};

export default HomePage;