import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Profilelogo from '../assets/profile.png';
import '../styles.css';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        address: '',
        bioDetails: '',
        profilePic: '', 
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = JSON.parse(localStorage.getItem("Users"));
            if (userData) {
                try {
                    const res = await axios.get(`http://localhost:9000/user/${userData._id}`);
                    setUser(res.data.user);
                    setFormData({
                        username: res.data.user.username,
                        email: res.data.user.email,
                        phone: res.data.user.phone,
                        address: res.data.user.address,
                        bioDetails: res.data.user.bioDetails,
                        profilePic: res.data.user.profilePicture || '', 
                    });
                } catch (err) {
                    console.error("Error fetching user data:", err);
                    toast.error("Error fetching user data.");
                }
            } else {
                toast.error("You need to be logged in to view your profile.");
                navigate("/login");
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0]; 
        if (file) {
            setFormData({ ...formData, profilePic: file }); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = JSON.parse(localStorage.getItem("Users"));
        
        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.username);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('bioDetails', formData.bioDetails);
        
        if (formData.profilePic) {
            formDataToSend.append('profilePic', formData.profilePic); 
        }
    
        try {
            const res = await axios.put(`http://localhost:9000/user/${userData._id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',  
                },
            });
            toast.success("Profile updated successfully.");
            setUser(res.data.user);
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error("Error updating profile.");
        }
    };
    

    if (!user) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>User Profile</h2>
            </div>
            <div className="profile-details">
                <div className="profile-left">
                    <div className="profile-pic-container">
                        <img
                            src={formData.profilePic || Profilelogo}
                            alt="Profile"
                            className="profile-pic"
                        />
                        {isEditing && (
                            <label htmlFor="profilePicInput" className="edit-pic-button">Change Picture</label>
                        )}
                        {isEditing && <input id="profilePicInput" type="file" accept="image/*" onChange={handleProfilePicChange} />}
                    </div>
                </div>
                <div className="profile-right">
                    <div className="profile-info">
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p><strong>Address:</strong> {user.address}</p>
                        <p><strong>Bio:</strong> {user.bioDetails}</p>
                    </div>

                    {isEditing ? (
                        <form className="profile-form" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="Username"
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Email"
                            />
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone"
                            />
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Address"
                            />
                            <textarea
                                name="bioDetails"
                                value={formData.bioDetails}
                                onChange={handleChange}
                                placeholder="Bio"
                            />
                            <button type="submit" className="save-changes-btn">Update Profile</button>
                        </form>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="edit-profile-btn">Edit Profile</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
