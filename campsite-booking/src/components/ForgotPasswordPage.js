import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userInfo = { email };

        try {
            const res = await axios.post("http://localhost:9000/user/forgot-password", userInfo);
            toast.success(res.data.message);
            navigate("/login");  // Redirect to login page
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.message);
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Send Reset Link</button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
