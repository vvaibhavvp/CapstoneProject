import React, { useState } from "react";
import "../styles.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userInfo = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const res = await axios.post(
        "http://localhost:9000/user/login",
        userInfo
      );
      if (res.data) {
        toast.success("Login Successfully");
        localStorage.setItem("Users", JSON.stringify(res.data.user));
        navigate("/", { replace: true });

        // Optional: reload to reflect new login state
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.error("Error: Invalid Email or Password");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <div>
          <p>
            <a href="/forgot-password">Forgot Password?</a>
          </p>
          <p>
            Don’t have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
