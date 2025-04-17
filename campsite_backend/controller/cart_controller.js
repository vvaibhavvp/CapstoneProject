import mongoose from "mongoose";
import Cart from "../models/cart_model.js";
import {Campsite} from "../models/Campsite_model.js"; 
import Booking from "../models/Booking_model.js";
import Subscription from "../models/Subscription_model.js";

export const checkAvailability = async (req, res) => {
    try {
        const { campsite_id, start_date, end_date } = req.body;

        if (!mongoose.isValidObjectId(campsite_id)) {
            return res.status(400).json({ message: "Invalid campsite ID" });
        }

        const campsite = await Campsite.findById(campsite_id);
        if (!campsite) {
            return res.status(404).json({ message: "Campsite not found" });
        }

        const campsiteStartDate = new Date(campsite.start_date);
        const campsiteEndDate = new Date(campsite.end_date);
        const bookingStartDate = new Date(start_date);
        const bookingEndDate = new Date(end_date);

        // Check if the booking dates are within the campsite availability
        if (bookingStartDate < campsiteStartDate || bookingEndDate > campsiteEndDate) {
            return res.json({ available: false, message: "Selected dates are not available for booking." });
        }

        return res.json({ available: true });
    } catch (error) {
        console.error("Error checking availability:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Add to Cart function to ensure availability check is always done
export const addToCart = async (req, res) => {
    try {
        const { user_id, campsite_id, start_date, end_date, total_amount, payment_status, guests } = req.body;

        if (!mongoose.isValidObjectId(user_id) || !mongoose.isValidObjectId(campsite_id)) {
            return res.status(400).json({ message: "Invalid user or campsite ID" });
        }

        const campsite = await Campsite.findById(campsite_id);
        if (!campsite) {
            return res.status(404).json({ message: "Campsite not found" });
        }

        const campsiteStartDate = new Date(campsite.start_date);
        const campsiteEndDate = new Date(campsite.end_date);
        const bookingStartDate = new Date(start_date);
        const bookingEndDate = new Date(end_date);

        if (bookingStartDate < campsiteStartDate || bookingEndDate > campsiteEndDate) {
            return res.status(400).json({ message: `Booking dates must be between ${campsiteStartDate.toISOString().split('T')[0]} and ${campsiteEndDate.toISOString().split('T')[0]}.` });
        }

        // Ensure bookingEndDate is after bookingStartDate
        if (bookingEndDate <= bookingStartDate) {
            return res.status(400).json({ message: "End date must be after the start date." });
        }

        // Calculate the correct number of nights (not days)
        const numberOfNights = (bookingEndDate - bookingStartDate) / (1000 * 3600 * 24);

        // Ensure the amount is calculated correctly using campsite's per-night price
        const pricePerNight = parseFloat(campsite.amount);
        const totalAmount = pricePerNight * numberOfNights;

        const cartItem = new Cart({
            user_id: new mongoose.Types.ObjectId(user_id),
            campsite_id: new mongoose.Types.ObjectId(campsite_id),
            number_of_days: numberOfNights,
            start_date,
            end_date,
            guests,
            total_amount: totalAmount,
            payment_status,
        });

        await cartItem.save();
        res.status(201).json({ message: "Campsite added to cart successfully", cartItem });
    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Clear all items from cart after successful payment
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    await Cart.deleteMany({ user_id: userId });
    res.status(200).json({ message: "Cart cleared successfully." });

  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateGuestCount = async (req, res) => {
    try {
      const { id } = req.params;
      const { guests, total_amount } = req.body;
  
      // Validate guest count
      if (guests < 1) {
        return res.status(400).json({ message: "Guest count must be at least 1." });
      }
  
      // Find the cart item and update the guest count and total amount
      const updatedCartItem = await Cart.findByIdAndUpdate(
        id,
        { guests, total_amount },
        { new: true } // Return the updated document
      );
  
      if (!updatedCartItem) {
        return res.status(404).json({ message: "Cart item not found." });
      }
  
      res.status(200).json({ message: "Guest count updated successfully.", updatedCartItem });
    } catch (error) {
      console.error("Error updating guest count:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };  

  export const updateCartItem = async (req, res) => {
    try {
        const cartItemId = req.params.id;
        const { guests, total_amount } = req.body;

        const updatedCartItem = await Cart.findByIdAndUpdate(
            cartItemId,
            { guests, total_amount },
            { new: true } // Return the updated document
        );

        if (!updatedCartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({ message: "Cart item updated", updatedCartItem });
    } catch (error) {
        console.error("Error in updateCartItem:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
  

export const getCartItems = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Populate campsite details when fetching cart items
        const cartItems = await Cart.find({ user_id: userId }).populate("campsite_id");

        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ message: "No items found in cart" });
        }

        res.status(200).json({ cartItems });
    } catch (error) {
        console.error("Error in getCartItems:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Remove from Cart
export const removeFromCart = async (req, res) => {
    try {
        const cartItemId = req.params.id;
        const removedItem = await Cart.findByIdAndDelete(cartItemId);
        if (!removedItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkout = async (req, res) => {
    try {
      const { userId, discountAmount, totalAmount } = req.body;  // Receive discountAmount and totalAmount from frontend
      
      // Fetch all cart items for the user
      const cartItems = await Cart.find({ user_id: userId }).populate("campsite_id");
  
      if (!cartItems || cartItems.length === 0) {
        return res.status(404).json({ message: "No items found in cart" });
      }
  
      // Calculate subtotal, GST, and other details as needed (this can be adjusted if needed)
      let subtotal = 0;
      cartItems.forEach(item => {
        subtotal += item.total_amount || 0;
      });
  
      const GST_RATE = 0.05;  // 5% GST
      const gstAmount = subtotal * GST_RATE;
      
      
      // Store the booking details
      const booking = new Booking({
        user_id: userId,
        campsite_id: cartItems[0].campsite_id._id, // Use the first campsite_id or adjust accordingly
        checkin_date: cartItems[0].start_date,
        checkout_date: cartItems[0].end_date,
        base_amount: subtotal,
        gst_amount: gstAmount,
        discount_amount: discountAmount,  // Use the received discount amount
        total_amount: totalAmount,        // Use the received total amount
        payment_status: "Unpaid",
        booking_status: "Pending"
      });
  
      await booking.save();
  
      res.status(200).json({
        message: "Booking confirmed. Proceeding to payment.",
        bookingId: booking._id,
        discountAmount: discountAmount  // Return the discountAmount back to frontend
      });
    } catch (error) {
      console.error("Error during checkout:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  