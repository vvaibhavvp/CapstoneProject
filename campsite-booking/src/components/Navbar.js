import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Campsite Booking</Link>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link className="nav-link" to="/">
            Home
          </Link>
        </li>
        {user && (
          <li className="nav-item">
            <Link className="nav-link" to="/subscription">
              Subscription
            </Link>
          </li>
        )}
        <li className="nav-item">
          <Link className="nav-link" to="/contact">
            Contact
          </Link>
        </li>
        {user ? (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link btn" onClick={logout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">
                Signup
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
