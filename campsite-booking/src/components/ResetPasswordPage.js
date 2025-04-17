import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const userInfo = { token, password, confirmPassword };

        try {
            const res = await axios.post("http://localhost:9000/user/reset-password", userInfo);
            toast.success(res.data.message);
            navigate("/login");  // Redirect to login page after successful reset
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.message);
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
