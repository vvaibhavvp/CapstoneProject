import User from "../models/user_model.js";
import bcryptjs from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const SignUp = async (req, res) => {
  try {
    const { username, email, password, role, confirmPassword } = req.body;

    // Check if the email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the password before saving
    const hashPassword = await bcryptjs.hash(password, 10);

    const createdUser = new User({
      username,
      email,
      password: hashPassword,
      role: role || "User", // Default role is User if not provided
    });

    await createdUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
        role: createdUser.role,
      },
    });
  } catch (error) {
    console.log("Error:" + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin: View All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "User" }).select("-password");
    res.status(200).json({ users });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: "User" });
    const stats = { userCount };
    res.status(200).json({ stats });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Upload Profile 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve("../campsite-booking/public/images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("profilePic");

export const updateUserProfile = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload failed" });
    }

    try {
      const { username, email, phone, address, bioDetails } = req.body;
      const profilePic = req.file ? `/images/${req.file.filename}` : undefined;

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          username,
          email,
          phone,
          address,
          bioDetails,
          profilePicture: profilePic,
        },
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.log("Error: " + error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

//  Forgot Password Flow 

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Please click the link to reset: ${resetUrl}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("Error details:", err);
        return res.status(500).json({ message: "Error sending email" });
      }
      return res.status(200).json({ message: "Reset link sent to email" });
    });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been successfully reset" });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
