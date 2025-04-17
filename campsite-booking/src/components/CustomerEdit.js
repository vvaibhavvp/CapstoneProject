"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import "./Adminstyles.css"; 
const CustomerEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "User",
  })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/user/customers/${id}`)
        const { username, email, role } = response.data
        setFormData({
          username,
          email,
          password: "", // Password field is empty for security
          role,
        })
        setLoading(false)
      } catch (error) {
        console.error("Error fetching customer:", error)
        toast.error("Failed to load customer data")
        navigate("/admin/customers")
      }
    }

    fetchCustomer()
  }, [id, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Create update object (only include password if it was provided)
    const updateData = {
      username: formData.username,
      email: formData.email,
      role: formData.role,
    }

    if (formData.password) {
      updateData.password = formData.password
    }

    try {
      setUpdating(true)
      await axios.put(`http://localhost:9000/user/customers/${id}`, updateData)
      toast.success("Customer updated successfully")
      navigate("/admin/customers")
    } catch (error) {
      console.error("Error updating customer:", error)
      toast.error(error.response?.data?.message || "Failed to update customer")
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="admin-container loading">Loading customer data...</div>
  }

  return (
    <div className="admin-container">
      <h1>Edit Customer</h1>

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
            <label htmlFor="password">Password (Leave blank to keep current)</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
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
            <button type="submit" className="submit-button" disabled={updating}>
              {updating ? "Updating..." : "Update Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerEdit

