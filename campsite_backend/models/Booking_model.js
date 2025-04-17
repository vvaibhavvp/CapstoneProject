import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  campsite_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campsite",
    required: true
  },
  checkin_date: {
    type: Date,
    required: true
  },
  checkout_date: {
    type: Date,
    required: true
  },
  base_amount: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  gst_amount: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  discount_amount: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  total_amount: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  booking_status: {
    type: String,
    enum: ["Confirmed", "Pending", "Cancelled"],
    default: "Pending"
  },
  payment_status: {
    type: String,
    enum: ["Paid", "Unpaid"],
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
