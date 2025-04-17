// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthProvider";
// import { useNavigate } from "react-router-dom";
// import "./Adminstyles.css";

// const AdminDashboard = () => {
//     const [campsites, setCampsites] = useState([]);
//     const [formData, setFormData] = useState({
//         campsite_name: "",
//         description: "",
//         address: "",
//         amount: "",
//         amenities: "",
//         image: "",
//         availability: ""
//     });

//     const [editMode, setEditMode] = useState(false);
//     const [editId, setEditId] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const navigate = useNavigate();
//     const [authUser] = useAuth();

//     useEffect(() => {
//         if (!authUser || authUser.role !== "Admin") {
//             navigate("/login"); // Redirect non-admins
//         }
//         fetchCampsites();
//     }, [authUser, navigate]);

//     const fetchCampsites = async () => {
//         try {
//             const res = await axios.get("http://localhost:9000/campsites");
//             setCampsites(res.data);
//         } catch (error) {
//             console.error("Error fetching campsites:", error);
//         }
//     };

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleCreateOrUpdate = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             if (editMode) {
//                 await axios.put(`http://localhost:9000/campsites/${editId}`, formData);
//                 setEditMode(false);
//                 setEditId(null);
//             } else {
//                 await axios.post("http://localhost:9000/campsites", formData);
//             }
//             fetchCampsites();
//             setFormData({ campsite_name: "", description: "", address: "", amount: "", amenities: "", image: "", availability: "" });
//         } catch (error) {
//             console.error("Error adding campsite:", error);
//         }
//         setLoading(false);
//     };

//     const handleEdit = (campsite) => {
//         setFormData(campsite);
//         setEditMode(true);
//         setEditId(campsite._id);
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure you want to delete this campsite?")) {
//             try {
//                 await axios.delete(`http://localhost:9000/campsites/${id}`);
//                 fetchCampsites();
//             } catch (error) {
//                 console.error("Error deleting campsite:", error);
//             }
//         }
//     };

//     return (
//         <div className="admin-dashboard">
//             <h1>Admin Dashboard - Manage Campsites</h1>

//             <form onSubmit={handleCreateOrUpdate}>
//                 <input type="text" name="campsite_name" placeholder="Campsite Name" value={formData.campsite_name} onChange={handleChange} required />
//                 <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
//                 <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
//                 <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} required />
//                 <input type="text" name="amenities" placeholder="Amenities (comma separated)" value={formData.amenities} onChange={handleChange} required />
//                 <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required />
//                 <select name="availability" value={formData.availability} onChange={handleChange} required>
//                     <option value="">Select Availability</option>
//                     <option value="Available">Available</option>
//                     <option value="Not Available">Not Available</option>
//                 </select>
//                 <button type="submit" disabled={loading}>{editMode ? "Update Campsite" : "Add Campsite"}</button>
//             </form>

//             <h2>Existing Campsites</h2>
//             <div className="campsite-list">
//                 {campsites.map((camp) => (
//                     <div className="campsite-card" key={camp._id}>
//                         <h3>{camp.campsite_name}</h3>
//                         <p>{camp.description}</p>
//                         <p><strong>Address:</strong> {camp.address}</p>
//                         <p><strong>Price:</strong> ${parseFloat(camp.amount).toFixed(2)}</p>
//                         <p><strong>Amenities:</strong> {camp.amenities}</p>
//                         <img src={camp.image} alt={camp.campsite_name} className="campsite-image"/>
//                         <p><strong>Status:</strong> {camp.availability}</p>
//                         <button onClick={() => handleEdit(camp)}>Edit</button>
//                         <button onClick={() => handleDelete(camp._id)}>Delete</button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;
"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Adminstyles.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    customerCount: 0,
    campsiteCount: 0,
    bookingCount: 0,
    recentBookings: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/user/dashboard"
        );
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <div className="admin-nav">
        <Link to="/admin/dashboard" className="admin-nav-link active">
          Dashboard
        </Link>
        <Link to="/admin/customers" className="admin-nav-link">
          Customers
        </Link>
        <Link to="/admin/campsite" className="admin-nav-link">
          Campsites
        </Link>
        <Link to="/admin/bookings" className="admin-nav-link">
          Bookings
        </Link>
        <Link to="/admin/subscriptions" className="admin-nav-link">
          Subscriptions
        </Link>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Customers</h3>
          <p className="stat-number">{stats.customerCount}</p>
          <Link to="/admin/customers" className="view-all">
            View All
          </Link>
        </div>

        <div className="stat-card">
          <h3>Campsites</h3>
          <p className="stat-number">{stats.campsiteCount}</p>
          <Link to="/campsite" className="view-all">
            View All
          </Link>
        </div>

        <div className="stat-card">
          <h3>Bookings</h3>
          <p className="stat-number">{stats.bookingCount}</p>
          <Link to="/" className="view-all">
            View All
          </Link>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Bookings</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Campsite</th>
              <th>Check-in Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentBookings.length > 0 ? (
              stats.recentBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>#{booking._id.substring(0, 8)}</td>
                  <td>{booking.user_name}</td>
                  <td>{booking.campsite_name}</td>
                  <td>{new Date(booking.checkin_date).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`status-badge ${booking.booking_status.toLowerCase()}`}
                    >
                      {booking.booking_status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No recent bookings
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
