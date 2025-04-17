// Subscription_model.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subscription_plan: {
    type: String,
    required: true,
  },
  discount_rate: {
    type: Number,
    default: 0,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  subscription_status: {
    type: String,
    enum: ["Active", "Expired"],
    default: "Active",
  },
  payment_status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  payment_amount: {
    type: Number,
    required: true,
  },
  payment_details: {
    type: Object,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

SubscriptionSchema.pre("save", function (next) {
  if (this.end_date < new Date()) {
    this.subscription_status = "Expired";
  }
  next();
});

const Subscription = mongoose.model("Subscription", SubscriptionSchema);
export default Subscription;
