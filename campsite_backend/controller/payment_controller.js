import Booking from "../models/Booking_model.js";
import Payment from "../models/Payment_model.js";

export const processPayment = async (req, res) => {
    try {
        const { booking_id, payment_method, pay_amount, payment_status } = req.body;
        
        // Fetch the booking details
        const booking = await Booking.findById(booking_id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Simulate payment process and create a payment record
        const payment = new Payment({
            booking_id: booking._id,
            payment_method,
            pay_amount,
            payment_status,
            payment_date: new Date(),
        });

        // Save the payment record
        await payment.save();

        // Update the booking status after payment simulation
        booking.payment_status = payment_status === "Success" ? "Paid" : "Failed";
        booking.booking_status = payment_status === "Success" ? "Confirmed" : "Pending";
        await booking.save();

        res.status(200).json({ success: true, message: "Payment processed successfully" });
    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getBookingDetails = async (req, res) => {
    try {
        const { bookingId } = req.params;
        console.log("Fetching booking details for bookingId:", bookingId);  
        const booking = await Booking.findById(bookingId).populate('campsite_id');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        //booking.total_amount = parseFloat(booking.total_amount.toString());
        console.log(booking.total_amount);
        res.json({ booking });
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
