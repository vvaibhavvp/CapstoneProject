"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import "./Adminstyles.css"; 
const CustomerList = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:9000/user/customers")
      setCustomers(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching customers:", error)
      toast.error("Failed to load customers")
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://localhost:9000/user/customers/${id}`)
        toast.success("Customer deleted successfully")
        fetchCustomers()
      } catch (error) {
        console.error("Error deleting customer:", error)
        toast.error("Failed to delete customer")
      }
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="admin-container">
      <h1>Customer Management</h1>

      <div className="admin-nav">
        <Link to="/admin/dashboard" className="admin-nav-link">
          Dashboard
        </Link>
        <Link to="/admin/customers" className="admin-nav-link active">
          Customers
        </Link>
        <Link to="/camps" className="admin-nav-link">
          Campsites
        </Link>
        <Link to="/" className="admin-nav-link">
          Bookings
        </Link>
        <Link to="/admin/subscriptions" className="admin-nav-link">
          subscription
        </Link>
      </div>

      <div className="admin-actions">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search"
          />
        </div>
        <Link to="/admin/customers/create" className="admin-button">
          Add New Customer
        </Link>
      </div>

      {loading ? (
        <div className="loading">Loading customers...</div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id}>
                    <td>#{customer._id.substring(0, 8)}</td>
                    <td>{customer.username}</td>
                    <td>{customer.email}</td>
                    <td>{customer.role}</td>
                    <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <Link
                        to={`/admin/customers/edit/${customer._id}`}
                        className="edit-button"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(customer._id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    {searchTerm
                      ? "No customers match your search"
                      : "No customers found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CustomerList

