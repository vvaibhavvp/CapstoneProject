import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Subscriptions.css";

// Helper function to check if subscription is active
function isSubscriptionActive(subscription) {
  if (!subscription) return false;
  const now = new Date();
  const endDate = new Date(subscription.end_date);
  return subscription.subscription_status === "Active" && endDate > now;
}

const Subscriptions = () => {
  const [plans] = useState([
    {
      id: 1,
      name: "Gold",
      price: 49.99,
      discount_rate: 10,
      description:
        "Access to premium features, priority support, early access to campsite bookings, and complimentary camping gear.",
    },
    {
      id: 2,
      name: "Silver",
      price: 29.99,
      discount_rate: 5,
      description:
        "Perfect for regular users with essential features, seasonal promotions, and community access at an affordable price.",
    },
    {
      id: 3,
      name: "Platinum",
      price: 79.99,
      discount_rate: 15,
      description:
        "Ultimate subscription with VIP perks, exclusive access, early feature releases, and personalized customer support.",
    },
  ]);

  const [subscription, setSubscription] = useState(null);
  const [expandedPlanId, setExpandedPlanId] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
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
  const [paymentError, setPaymentError] = useState("");

  const userData = JSON.parse(localStorage.getItem("Users"));
  const userId = userData ? userData._id : null;

  const durations = [
    { label: "1 Month", months: 1 },
    { label: "3 Months", months: 3 },
    { label: "6 Months", months: 6 },
    { label: "1 Year", months: 12 },
  ];

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:9000/user/subscriptions/status?userId=${userId}`)
        .then((response) => {
          setSubscription(response.data);
        })
        .catch((error) => {
          console.error("Error fetching subscription:", error);
          setSubscription(null);
        });
    }
  }, [userId]);

  const subscriptionIsActive = isSubscriptionActive(subscription);
  const endDateStr = subscription?.end_date
    ? new Date(subscription.end_date).toLocaleDateString()
    : "";

  // VALIDATION LOGIC — copied exactly from your PaymentPage.js
  const validateCardDetails = (details) => {
    const { cardNumber, expirationDate, cvv } = details;

    const cardNumberRegex = /^\d{16}$/;
    const expirationDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;

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

  const handleDurationClick = (plan, duration) => {
    if (subscriptionIsActive) {
      alert(
        `You already have an active subscription (${subscription.subscription_plan}) until ${endDateStr}.`
      );
      return;
    }
    setSelectedPlan(plan);
    setSelectedDuration(duration);
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (subscriptionIsActive) {
      setPaymentError("You already have an active subscription.");
      return;
    }

    // Validate based on selected payment method
    if (paymentMethod === "Credit Card") {
      if (!validateCardDetails(creditCardDetails)) {
        return;
      }
    }
    if (paymentMethod === "Debit Card") {
      if (!validateCardDetails(debitCardDetails)) {
        return;
      }
    }

    const start_date = new Date().toISOString();
    const end_date = new Date(
      new Date().setMonth(new Date().getMonth() + selectedDuration.months)
    ).toISOString();
    const payment_amount = parseFloat(
      (selectedPlan.price * selectedDuration.months).toFixed(2)
    );

    const paymentData = {
      user_id: userId,
      subscription_plan: selectedPlan.name,
      discount_rate: selectedPlan.discount_rate,
      start_date,
      end_date,
      subscription_status: "Active",
      payment_status: "Completed",
      payment_amount,
      payment_method: paymentMethod,
      payment_details:
        paymentMethod === "Credit Card" ? creditCardDetails : debitCardDetails,
    };

    try {
      await axios.post("http://localhost:9000/user/subscriptions", paymentData);
      alert(`Payment Successful! Subscribed to ${selectedPlan.name} Plan.`);
      setSubscription(paymentData);
      resetPaymentForm();
    } catch (error) {
      console.error("Payment failed:", error);
      setPaymentError("Payment failed. Please try again.");
    }
  };

  const resetPaymentForm = () => {
    setShowPaymentForm(false);
    setExpandedPlanId(null);
    setSelectedPlan(null);
    setSelectedDuration(null);
    setPaymentMethod("");
    setCreditCardDetails({ cardNumber: "", expirationDate: "", cvv: "" });
    setDebitCardDetails({ cardNumber: "", expirationDate: "", cvv: "" });
    setPaymentError("");
  };

  const headerText = subscriptionIsActive
    ? `Your current subscription: ${subscription.subscription_plan} (Expires: ${endDateStr})`
    : "Enroll for Subscription";

  return (
    <div className="container">
      <h2>{headerText}</h2>

      {subscriptionIsActive && (
        <div className="subscription-banner">
          <p>
            You have the <strong>{subscription.subscription_plan}</strong> plan
            active until <strong>{endDateStr}</strong>.
          </p>
          <p>You can't subscribe to another plan until this expires.</p>
        </div>
      )}

      <div className="subscription-list">
        {plans.map((plan) => (
          <div key={plan.id} className="subscription-card">
            <h3>{plan.name} Plan</h3>
            <p>{plan.description}</p>

            {expandedPlanId === plan.id && !subscriptionIsActive ? (
              <div className="subscription-details">
                <ul className="duration-options">
                  {durations.map((duration) => (
                    <li key={duration.months}>
                      <p>
                        <strong>{duration.label}</strong>: $
                        {(plan.price * duration.months).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleDurationClick(plan, duration)}
                      >
                        Subscribe for {duration.label}
                      </button>
                    </li>
                  ))}
                </ul>
                <button onClick={() => setExpandedPlanId(null)}>Cancel</button>
              </div>
            ) : (
              <button
                disabled={subscriptionIsActive}
                onClick={() =>
                  !subscriptionIsActive && setExpandedPlanId(plan.id)
                }
              >
                Subscribe
              </button>
            )}
          </div>
        ))}
      </div>

      {showPaymentForm && !subscriptionIsActive && (
        <div className="payment-form-container">
          <h3>Payment Details</h3>
          {paymentError && <p style={{ color: "red" }}>{paymentError}</p>}

          <div className="payment-methods">
            <div
              className={`payment-method-card ${
                paymentMethod === "Credit Card" ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod("Credit Card")}
            >
              <span>Credit Card</span>
            </div>
            <div
              className={`payment-method-card ${
                paymentMethod === "Debit Card" ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod("Debit Card")}
            >
              <span>Debit Card</span>
            </div>
            <div
              className={`payment-method-card ${
                paymentMethod === "PayPal" ? "selected" : ""
              }`}
              onClick={() => setPaymentMethod("PayPal")}
            >
              <span>PayPal</span>
            </div>
          </div>

          <form onSubmit={handlePaymentSubmit} className="payment-form">
            {(paymentMethod === "Credit Card" ||
              paymentMethod === "Debit Card") && (
              <div className="card-details">
                <input
                  type="text"
                  placeholder="Name on Card"
                  value={
                    paymentMethod === "Credit Card"
                      ? creditCardDetails.nameOnCard
                      : debitCardDetails.nameOnCard
                  }
                  onChange={(e) =>
                    paymentMethod === "Credit Card"
                      ? setCreditCardDetails({
                          ...creditCardDetails,
                          nameOnCard: e.target.value,
                        })
                      : setDebitCardDetails({
                          ...debitCardDetails,
                          nameOnCard: e.target.value,
                        })
                  }
                  className="input-field"
                  required
                />

                <input
                  type="text"
                  placeholder="Card Number"
                  value={
                    paymentMethod === "Credit Card"
                      ? creditCardDetails.cardNumber
                      : debitCardDetails.cardNumber
                  }
                  onChange={(e) =>
                    paymentMethod === "Credit Card"
                      ? setCreditCardDetails({
                          ...creditCardDetails,
                          cardNumber: e.target.value,
                        })
                      : setDebitCardDetails({
                          ...debitCardDetails,
                          cardNumber: e.target.value,
                        })
                  }
                  className="input-field"
                  required
                />
                <div className="credit-card-fields">
                  <input
                    type="text"
                    placeholder="Expiration Date (MM/YY)"
                    value={
                      paymentMethod === "Credit Card"
                        ? creditCardDetails.expirationDate
                        : debitCardDetails.expirationDate
                    }
                    onChange={(e) =>
                      paymentMethod === "Credit Card"
                        ? setCreditCardDetails({
                            ...creditCardDetails,
                            expirationDate: e.target.value,
                          })
                        : setDebitCardDetails({
                            ...debitCardDetails,
                            expirationDate: e.target.value,
                          })
                    }
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={
                      paymentMethod === "Credit Card"
                        ? creditCardDetails.cvv
                        : debitCardDetails.cvv
                    }
                    onChange={(e) =>
                      paymentMethod === "Credit Card"
                        ? setCreditCardDetails({
                            ...creditCardDetails,
                            cvv: e.target.value,
                          })
                        : setDebitCardDetails({
                            ...debitCardDetails,
                            cvv: e.target.value,
                          })
                    }
                    className="input-field"
                    required
                  />
                </div>
              </div>
            )}

            {paymentMethod === "PayPal" && (
              <div className="paypal-message">
                <p>
                  Please log into your PayPal account to complete the payment.
                </p>
              </div>
            )}

            <button type="submit" className="submit-btn">
              Confirm Payment
            </button>
            <br></br>
            <br></br>
            <button
              type="button"
              onClick={resetPaymentForm}
              className="submit-btn"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
