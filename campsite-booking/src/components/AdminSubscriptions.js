"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AdminSubscriptions.css";

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9000/admin/subscriptions")
      .then((response) => {
        console.log("Fetched subscriptions:", response.data);
        setSubscriptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subscriptions:", error);
      });
  }, []);

  return (
    <div className="admin-container">
      <h1>Subscription Management</h1>
      <div className="admin-nav">
        <Link to="/admin/dashboard" className="admin-nav-link">
          Dashboard
        </Link>
        <Link to="/admin/customers" className="admin-nav-link">
          Customers
        </Link>
        <Link to="/camps" className="admin-nav-link">
          Campsites
        </Link>
        <Link to="/" className="admin-nav-link">
          Bookings
        </Link>
        <Link to="/admin/subscriptions" className="admin-nav-link active">
          Subscriptions
        </Link>
      </div>

      <h2>Subscribed Users</h2>
      {subscriptions.length === 0 ? (
        <p>No subscriptions found.</p>
      ) : (
        <table className="subscriptions-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Subscription Plan</th>
              <th>Discount Rate</th>
              <th>Amount Paid ($)</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub._id || sub.id}>
                <td>
                  {sub.user_id && typeof sub.user_id === "object"
                    ? sub.user_id.name || sub.user_id._id
                    : sub.user_id}
                </td>
                <td>{sub.subscription_plan}</td>
                <td>{sub.discount_rate}%</td>
                <td>
                  {typeof sub.payment_amount === "number"
                    ? sub.payment_amount.toFixed(2)
                    : "N/A"}
                </td>
                <td>{new Date(sub.start_date).toLocaleDateString()}</td>
                <td>{new Date(sub.end_date).toLocaleDateString()}</td>
                <td>{sub.subscription_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminSubscriptions;
