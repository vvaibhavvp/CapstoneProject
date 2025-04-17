import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    booking_id: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    payment_method: {
        type: String,
        required: true
    },
    pay_amount: {
        type: Schema.Types.Decimal128,
        required: true
    },
    payment_status: {
        type: String,
        required: true,
        enum: ['Success', 'Fail']
    },
    payment_date: {
        type: Date,
        default: Date.now,
    }
});

const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;