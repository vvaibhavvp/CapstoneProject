import express from "express";
import {
  getSubscriptionStatus,
  createOrUpdateSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription, 
  getSubscriptionByUserId
} from "../controller/subscriptionController.js";

const router = express.Router();

// Endpoint for getting the subscription status for the logged-in user
router.get("/status", getSubscriptionStatus);

// CRUD endpoints for subscription management (this matches your frontend correctly!)
router.post("/", createOrUpdateSubscription);
router.get("/", getAllSubscriptions);
router.get("/:id", getSubscriptionById);
router.put("/:id", updateSubscription);
router.delete("/:id", deleteSubscription);

router.get("/user/:userId", getSubscriptionByUserId);

export default router;
