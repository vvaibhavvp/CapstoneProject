import mongoose from "mongoose";
import Subscription from "../models/Subscription_model.js";
// Create a new subscription (used for both user and admin operations)
// If a user subscribes, include the user_id in the request body.
// subscriptionController.js
export const createOrUpdateSubscription = async (req, res) => {
  try {
    const {
      user_id,
      subscription_plan,
      discount_rate,
      start_date,
      end_date,
      subscription_status,
      payment_status,
      payment_amount, 
      payment_details,
    } = req.body;

    if (!subscription_plan || !start_date || !end_date || !payment_amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let existingSubscription = await Subscription.findOne({ user_id });

    if (existingSubscription) {
      const currentDate = new Date();
      const subscriptionEndDate = new Date(existingSubscription.end_date);
      const isStillActive =
        existingSubscription.subscription_status === "Active" &&
        subscriptionEndDate > currentDate;

      if (isStillActive) {
        return res.status(403).json({
          message: `You already have an active subscription. You can update it after ${subscriptionEndDate.toLocaleDateString()}.`,
        });
      }

      existingSubscription.subscription_plan = subscription_plan;
      existingSubscription.discount_rate = discount_rate || 0;
      existingSubscription.start_date = start_date;
      existingSubscription.end_date = end_date;
      existingSubscription.subscription_status =
        subscription_status || "Active";
      existingSubscription.payment_status = payment_status || "Pending";
      existingSubscription.payment_amount = payment_amount; 
      existingSubscription.payment_details = payment_details || null;

      const updatedSubscription = await existingSubscription.save();
      return res.status(200).json(updatedSubscription);
    } else {
      const newSubscription = new Subscription({
        user_id,
        subscription_plan,
        discount_rate: discount_rate || 0,
        start_date,
        end_date,
        subscription_status: subscription_status || "Active",
        payment_status: payment_status || "Pending",
        payment_amount, 
        payment_details: payment_details || null,
      });

      const savedSub = await newSubscription.save();
      return res.status(201).json(savedSub);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// Get all subscriptions (Admin view)
export const getAllSubscriptions = async (req, res) => {
  try {
    // Populate user_id to show user's name and email if available.
    const subscriptions = await Subscription.find().populate(
      "user_id",
      "name email"
    );
    return res.status(200).json(subscriptions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a specific subscription by ID
export const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id).populate(
      "user_id",
      "name email"
    );
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    return res.status(200).json(subscription);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a subscription (Admin CRUD)
export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    return res.status(200).json(updatedSubscription);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a subscription (Admin CRUD)
export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubscription = await Subscription.findByIdAndDelete(id);
    if (!deletedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    return res.status(200).json({ message: "Subscription deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get the subscription status for the logged-in user (for non-admins)


export const getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.query.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User is not authenticated" });
    }

    const subscription = await Subscription.findOne({
      user_id: new mongoose.Types.ObjectId(String(userId)),
    });

    if (!subscription) {
      return res.status(404).json({ message: "No subscription found" });
    }

    return res.status(200).json(subscription);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getSubscriptionByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("User ID in query:", userId);
    const subscription = await Subscription.findOne({ user_id: userId });
    console.log("Subscription:", subscription);

    if (!subscription) {
      return res.status(200).json({ discount_rate: 0 }); // No subscription
    }

    return res.status(200).json({ discount_rate: subscription.discount_rate });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
