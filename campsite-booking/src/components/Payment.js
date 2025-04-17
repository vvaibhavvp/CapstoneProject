import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Success');
  const [creditCardDetails, setCreditCardDetails] = useState({
    nameOnCard: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });
  const [debitCardDetails, setDebitCardDetails] = useState({
    nameOnCard: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });

  const { bookingId } = useParams();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/payment/${bookingId}`);
        const bookingData = response.data.booking;
        setBooking(bookingData);
      } catch (error) {
        console.error("Error fetching booking:", error);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const validateCardDetails = (details) => {
    const { nameOnCard, cardNumber, expirationDate, cvv } = details;

    const cardNumberRegex = /^\d{16}$/;
    const expirationDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;

    if (!nameOnCard.trim()) {
      alert("Please enter the name on the card.");
      return false;
    }

    if (!cardNumberRegex.test(cardNumber)) {
      alert("Please enter a valid 16-digit card number.");
      return false;
    }

    if (!expirationDateRegex.test(expirationDate)) {
      alert("Please enter a valid expiration date in MM/YY format.");
      return false;
    }

    const [month, year] = expirationDate.split("/").map(Number);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      alert("The expiration date has already passed.");
      return false;
    }

    if (!cvvRegex.test(cvv)) {
      alert("Please enter a valid 3-digit CVV.");
      return false;
    }

    return true;
  };


  const handlePayment = async (event) => {
    event.preventDefault();

    if (
      paymentMethod === "Credit Card" &&
      !validateCardDetails(creditCardDetails)
    )
      return;
    if (
      paymentMethod === "Debit Card" &&
      !validateCardDetails(debitCardDetails)
    )
      return;

    const simulatedPaymentStatus = paymentStatus;

    const paymentData = {
      booking_id: booking._id,
      payment_method: paymentMethod,
      pay_amount: booking.total_amount,
      payment_status: simulatedPaymentStatus,
    };

    try {
      const response = await axios.post(
        "http://localhost:9000/payment",
        paymentData
      );

      if (response.data.success) {
        // Clear cart items after successful payment
        await axios.delete(
          `http://localhost:9000/cart/clear/${booking.user_id}`
        );

        // Navigate to Thank You page
        window.location.href = "/thank-you";
      } else {
        alert("Payment was not successful, please try again.");
      }
    } catch (error) {
      console.error("Error during payment:", error);
      alert("An error occurred while processing your payment.");
    }
  };


  if (!booking) {
    return <div className="loading">Loading booking details...</div>;
  }

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method !== 'Credit Card' && method !== 'Debit Card') {
      setCreditCardDetails({ cardNumber: '', expirationDate: '', cvv: '' });
      setDebitCardDetails({ cardNumber: '', expirationDate: '', cvv: '' });
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h2>Complete Your Payment</h2>
      </div>
      <div className="payment-details">
        <p>
          <strong>Campsite:</strong> {booking.campsite_id?.campsite_name}
        </p>
        <p>
          <strong>Check-in:</strong>{" "}
          {new Date(booking.checkin_date).toLocaleDateString()}
        </p>
        <p>
          <strong>Check-out:</strong>{" "}
          {new Date(booking.checkout_date).toLocaleDateString()}
        </p>
        <p>
          <strong>Total Amount:</strong> $
          {parseFloat(booking.total_amount?.$numberDecimal).toFixed(2)}
        </p>
      </div>

      <form onSubmit={handlePayment} className="payment-form">
        <div className="payment-methods">
          <div
            className={`payment-method-card ${
              paymentMethod === "Credit Card" ? "selected" : ""
            }`}
            onClick={() => handlePaymentMethodChange("Credit Card")}
          >
            <span>Credit Card</span>
          </div>
          <div
            className={`payment-method-card ${
              paymentMethod === "Debit Card" ? "selected" : ""
            }`}
            onClick={() => handlePaymentMethodChange("Debit Card")}
          >
            <span>Debit Card</span>
          </div>
          <div
            className={`payment-method-card ${
              paymentMethod === "PayPal" ? "selected" : ""
            }`}
            onClick={() => handlePaymentMethodChange("PayPal")}
          >
            <span>PayPal</span>
          </div>
        </div>

        {paymentMethod === "Credit Card" && (
          <div className="credit-card-details">
            <h4>Credit Card Information</h4>
            <input
              type="text"
              placeholder="Name on Card"
              value={creditCardDetails.nameOnCard}
              onChange={(e) =>
                setCreditCardDetails({
                  ...creditCardDetails,
                  nameOnCard: e.target.value,
                })
              }
              className="input-field"
            />
            <input
              type="text"
              placeholder="Card Number"
              value={creditCardDetails.cardNumber}
              onChange={(e) =>
                setCreditCardDetails({
                  ...creditCardDetails,
                  cardNumber: e.target.value,
                })
              }
              className="input-field"
            />
            <div className="credit-card-fields">
              <input
                type="text"
                placeholder="Expiration Date (MM/YY)"
                value={creditCardDetails.expirationDate}
                onChange={(e) =>
                  setCreditCardDetails({
                    ...creditCardDetails,
                    expirationDate: e.target.value,
                  })
                }
                className="input-field"
              />
              <input
                type="text"
                placeholder="CVV"
                value={creditCardDetails.cvv}
                onChange={(e) =>
                  setCreditCardDetails({
                    ...creditCardDetails,
                    cvv: e.target.value,
                  })
                }
                className="input-field"
              />
            </div>
          </div>
        )}

        {paymentMethod === "Debit Card" && (
          <div className="debit-card-details">
            <h4>Debit Card Information</h4>
            <input
              type="text"
              placeholder="Name on Card"
              value={debitCardDetails.nameOnCard}
              onChange={(e) =>
                setDebitCardDetails({
                  ...debitCardDetails,
                  nameOnCard: e.target.value,
                })
              }
              className="input-field"
            />
            <input
              type="text"
              placeholder="Card Number"
              value={debitCardDetails.cardNumber}
              onChange={(e) =>
                setDebitCardDetails({
                  ...debitCardDetails,
                  cardNumber: e.target.value,
                })
              }
              className="input-field"
            />
            <div className="credit-card-fields">
              <input
                type="text"
                placeholder="Expiration Date (MM/YY)"
                value={debitCardDetails.expirationDate}
                onChange={(e) =>
                  setDebitCardDetails({
                    ...debitCardDetails,
                    expirationDate: e.target.value,
                  })
                }
                className="input-field"
              />
              <input
                type="text"
                placeholder="CVV"
                value={debitCardDetails.cvv}
                onChange={(e) =>
                  setDebitCardDetails({
                    ...debitCardDetails,
                    cvv: e.target.value,
                  })
                }
                className="input-field"
              />
            </div>
          </div>
        )}

        {paymentMethod === "PayPal" && (
          <div className="paypal-details">
            <h4>PayPal Information</h4>
            <p>Please log into your PayPal account to complete the payment.</p>
          </div>
        )}

        <button type="submit" className="submit-btn">
          Confirm Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
