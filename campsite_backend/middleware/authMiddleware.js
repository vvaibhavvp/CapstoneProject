import User from "../models/user_model.js";

export const verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user || user.role !== "Admin") {
            return res.status(403).json({ message: "Access Denied: Admins Only" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
// Authentication Middleware (Ensures the user is logged in)
export const authMiddleware = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user logged in" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // Attach user to request for further use
        next(); // Proceed to the next middleware

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Admin Middleware (Ensures the user is an admin)
export const adminMiddleware = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: No user logged in" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "Admin") {
            return res.status(403).json({ message: "Access Denied: Admins Only" });
        }

        next(); // Proceed to admin routes

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
