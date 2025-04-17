import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);

  // Fetch all bookings from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:9000/admin/bookings");
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="admin-container">
    <div className="recent-activity">
      <h2>Admin Booking Details</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Campsite Name</th>
            <th>Check-In Date</th>
            <th>Check-Out Date</th>
            <th>Booking Status</th>
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.user_id?.username || "N/A"}</td> {/* Display N/A if no user */}
                <td>{booking.campsite_id?.campsite_name || "N/A"}</td> {/* Display N/A if no campsite */}
                <td>{new Date(booking.checkin_date).toLocaleDateString()}</td>
                <td>{new Date(booking.checkout_date).toLocaleDateString()}</td>
                <td>{booking.booking_status}</td>
                <td>{booking.payment_status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No bookings available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default AdminBooking;
