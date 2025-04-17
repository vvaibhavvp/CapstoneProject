import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    campsite_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campsite",
        required: true,
    },
    guests: {
        type: Number,
        required: true,
    },
    number_of_days: {  
        type: Number,
        required: true,
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    total_amount: {
        type: Number,
        required: true,
    },
    payment_status: {
        type: String,
        enum: ["Unpaid", "Paid"],
        default: "Unpaid",
    },
}, { timestamps: true });

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
