import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { paymentDetails } = location.state || {};

  return (
    <>
      <button className="back-button" onClick={() => navigate("/")}>
        <img src="/src/assets/arrow_icon.png" alt="" className="rotate-left" />
        Back
      </button>
      <div className="payment-success">
        <div>
          <h1>Payment Successful</h1>
          {paymentDetails && (
            <div className="payment-details">
              <p>Payment ID: {paymentDetails.razorpay_payment_id}</p>
              <p>Order ID: {paymentDetails.razorpay_order_id}</p>
              <p>Amount: {paymentDetails.amount}/- INR</p>
            </div>
          )}
          <p>Thank you for your payment. Your booking has been confirmed.</p>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
