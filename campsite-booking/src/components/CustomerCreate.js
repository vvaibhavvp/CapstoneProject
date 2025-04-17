"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import "./Adminstyles.css"; 
const CustomerCreate = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "User",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill all required fields")
      return
    }

    try {
      setLoading(true)
      await axios.post("http://localhost:9000/user/customers", formData)
      toast.success("Customer created successfully")
      navigate("/admin/customers")
    } catch (error) {
      console.error("Error creating customer:", error)
      toast.error(error.response?.data?.message || "Failed to create customer")
      setLoading(false)
    }
  }

  return (
    <div className="admin-container">
      <h1>Create New Customer</h1>

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
      </div>

      <div className="admin-form-container">
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate("/admin/customers")} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Creating..." : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerCreate