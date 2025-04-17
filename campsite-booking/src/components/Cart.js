import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./cart.css";
 
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const GST_RATE = 0.05;
  const user = JSON.parse(localStorage.getItem("Users"));
  const userId = user ? user._id : null;
  console.log(userId);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/cart/${userId}`);
        setCartItems(response.data.cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [userId]);

  useEffect(() => {
    if (cartItems.length > 0) {
      calculateDiscount(cartItems);
    }
  }, [cartItems]);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/cart/${id}`);
      const updatedItems = cartItems.filter((item) => item._id !== id);
      setCartItems(updatedItems);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleGuestChange = async (id, newGuestCount) => {
    try {
      const updatedItem = cartItems.find(item => item._id === id);
      const pricePerGuest = updatedItem.total_amount / updatedItem.guests;
      const newTotalAmount = pricePerGuest * newGuestCount;

      await axios.put(`http://localhost:9000/cart/updateGuestCount/${id}`, {
        guests: newGuestCount,
        total_amount: newTotalAmount
      });

      const updatedCartItems = cartItems.map(item =>
        item._id === id
          ? { ...item, guests: newGuestCount, total_amount: newTotalAmount }
          : item
      );
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error updating guest count:", error);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.total_amount || 0), 0);
  };

  const calculateDiscount = async (updatedCartItems) => {
    const subtotal = updatedCartItems.reduce((total, item) => total + (item.total_amount || 0), 0);

    try {
      const response = await axios.get(`http://localhost:9000/user/subscriptions/user/${userId}`);
      console.log("Subscription API Response:", response.data); 
      const discountRate = response.data?.discount_rate || 0;

      const discount = subtotal * (discountRate / 100);
      console.log("Calculated Discount:", discount); 
      setDiscountAmount(discount);
    } catch (error) {
      console.error("Error fetching subscription or calculating discount:", error);
      setDiscountAmount(0);
    }
  };

  const subtotal = calculateSubtotal();
  const gstAmount = subtotal * GST_RATE;
  const totalAmount = subtotal + gstAmount - discountAmount;

  const handleCheckout = async () => {
    try {
      const response = await axios.post("http://localhost:9000/cart/checkout", {
        userId,
        discountAmount,
        totalAmount,
      });

      if (response.data.bookingId) {
        const discountAmountFromResponse = response.data.discountAmount || 0;
        setDiscountAmount(discountAmountFromResponse);
        navigate(`/payment/${response.data.bookingId}`);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">No items in cart</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="cart-details">
                <p className="cart-item-name">{item.campsite_id?.campsite_name || "No Name"}</p>
                <p>Guests:
                  <input
                    type="number"
                    value={item.guests}
                    onChange={(e) => handleGuestChange(item._id, parseInt(e.target.value))}
                    min="1"
                    max="10"
                  />
                </p>
                <p>
                  Dates: <span>
                    {new Date(item.start_date).toLocaleDateString("en-CA", {
                      day: "2-digit", month: "numeric", year: "numeric"
                    })} to{" "}
                    {new Date(item.end_date).toLocaleDateString("en-CA", {
                      day: "2-digit", month: "numeric", year: "numeric"
                    })}
                  </span>
                </p>
                <p className="cart-total">
                  Total: <strong>${(item.total_amount || 0).toFixed(2)}</strong>
                </p>
              </div>
              <button className="remove-btn" onClick={() => handleRemove(item._id)}>Remove</button>
            </div>
          ))}

          <div className="cart-summary">
            <p>Subtotal: <span>${subtotal.toFixed(2)}</span></p>
            <p>GST (5%): <span>${gstAmount.toFixed(2)}</span></p>
            <p>Subscription Discount: <span>${discountAmount.toFixed(2)}</span></p>
            <p className="cart-grand-total">Total: <strong>${totalAmount.toFixed(2)}</strong></p>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;
