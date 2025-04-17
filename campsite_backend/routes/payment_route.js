import express from "express";
import { processPayment, getBookingDetails } from "../controller/payment_controller.js";

const router = express.Router();
router.post("/", processPayment);

router.get("/:bookingId", getBookingDetails);

export default router;