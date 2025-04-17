import React, { useState, useEffect } from "react";
import "./header.css";
import campLogo from "../../assets/camping.png";
import toast from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider.js";

function Header() {
  const [authUser, setAuthUser] = useAuth();
  const isAdmin = authUser && authUser.role === "Admin";
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const handleLogout = () => {
    try {
      setAuthUser({
        ...authUser,
        user: null,
      });
      localStorage.removeItem("Users");
      toast.success("Logout successfully");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Error: " + error);
    }
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`header-container ${scrolled ? "scrolled" : ""}`}>
      <div className="header-content">
        <div className="logo">
          <Link to="/" className="logo-link">
            <img
              src={campLogo}
              alt="Campsite Booking Logo"
              className="logo-image"
            />
            <span className="logo-text">Campsite Booking</span>
          </Link>
        </div>

        <div className="mobile-toggle" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={`nav-links ${showMobileMenu ? "mobile-active" : ""}`}>
          <div className="header-nav">
            <Link
              to="/"
              className={`header-button ${isActive("/") ? "active" : ""}`}
            >
              Home
            </Link>

            {/* Only show Subscription link to non-admin users */}
            {authUser && authUser.role !== "Admin" && (
               <>
              {/* <Link
              to="/camps"
              className={`header-button ${isActive("/camps") ? "active" : ""}`}
            >
              Camps
            </Link> */}
            <Link
              to="/campsiteList"
              className={`header-button ${isActive("/campsiteList") ? "active" : ""}`}
            >
              Campsites
            </Link>
            <Link
              to="/cart"
              className={`header-button ${isActive("/cart") ? "active" : ""}`}
            >
              Cart
            </Link>
              <Link
                to="/Subscriptions"
                className={`header-button ${isActive("/Subscriptions") ? "active" : ""}`}
              >
                Subscription
              </Link>
              </>
            )}

            {authUser ? (
              <>
                <Link
                  to="/profile"
                  className={`header-button ${isActive("/profile") ? "active" : ""}`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="header-button logout-btn"
                >
                  Logout
                </button>

                {isAdmin && (
                  <div className="admin-dropdown">
                    <button className="header-button admin-dropdown-btn">
                      Admin <span className="dropdown-arrow">▼</span>
                    </button>
                    <div className="admin-menu">
                      <Link to="/admin/dashboard" className="admin-link">
                        Dashboard
                      </Link>
                      <Link to="/admin/country" className="admin-link">
                        Country
                      </Link>
                      {/* <Link to="/admin/state" className="admin-link">
                        States
                      </Link> */}
                      <Link to="/admin/category" className="admin-link">
                        Category
                      </Link>
                      <Link to="/admin/campsite" className="admin-link">
                        Campsite
                      </Link>
                      <Link to="/admin/subscriptions" className="admin-link">
                        Subscription
                      </Link>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="auth-buttons">
                <Link
                  to="/login"
                  className={`header-button auth-btn ${isActive("/login") ? "active" : ""}`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`header-button auth-btn highlight ${isActive("/signup") ? "active" : ""}`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
