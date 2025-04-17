import express from "express";
import Booking from "../models/Booking_model.js";

const router = express.Router();

// Create a new booking
router.post("/create", async (req, res) => {
  try {
    const { campsite_id, user_id, guests, start_date, end_date, total_amount, payment_status } = req.body;

    // Check for missing fields
    if (!campsite_id || !user_id || !start_date || !end_date || !total_amount || !payment_status || guests < 1) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newBooking = new Booking({
      campsite_id,
      user_id,
      guests,
      checkin_date: start_date,
      checkout_date: end_date,
      total_amount,
      payment_status,
      booking_status: "Pending"
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking successful!", booking: newBooking });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

export default router;
