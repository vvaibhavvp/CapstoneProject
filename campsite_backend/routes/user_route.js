import express from "express";
import {
  SignUp,
  login,
  updateUserProfile,
  getUserById,
  forgotPassword,
  resetPassword,
} from "../controller/user_controller.js";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomer,
  getDashboardStats,
  updateCustomer,
} from "../controller/admin_controller.js";
import {
  createOrUpdateSubscription,
  getSubscriptionStatus,
} from "../controller/subscriptionController.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", SignUp);

// Admin routes
// router.get("/all", isAuthenticated, isAdmin, getAllUsers);
// router.get("/dashboard", isAuthenticated, isAdmin, getDashboardStats);
// router.get("/:id", isAuthenticated, isAdmin, getUserById);
// router.put("/:id", isAuthenticated, isAdmin, updateUser);
// router.delete("/:id", isAuthenticated, isAdmin, deleteUser);

// Subscription endpoints for users
router.post("/subscriptions", createOrUpdateSubscription);
router.get("/subscriptions", getSubscriptionStatus);

router.get("/dashboard", getDashboardStats);
router.get("/customers", getAllCustomers);
router.get("/customers/:id", getCustomer);
router.post("/customers", createCustomer);
router.put("/customers/:id", updateCustomer);
router.delete("/customers/:id", deleteCustomer);

router.get("/:id", getUserById);
router.put("/:id", updateUserProfile);

router.post("/forgot-password", forgotPassword); // Forgot password route
router.post("/reset-password", resetPassword); // Reset password route

export default router;
