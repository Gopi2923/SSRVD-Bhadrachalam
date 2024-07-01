import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import './PaymentFailure.css';

const PaymentFailure = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transactionId, totalAmount, errorMessage } = location.state || {};

  return (
    <>
      <button className="back-button" onClick={() => navigate("/")}>
        <img src="/src/assets/arrow_icon.png" alt="Back" className="rotate-left" />
        Back
      </button>
      <div className="payment-failure">
        <div>
          <h1>Payment Failed</h1>
          <FontAwesomeIcon icon={faTimesCircle} size="3x" style={{ color: 'red', margin: '10px 0' }} />
          <div className="payment-details">
            <p>Payment ID: {transactionId}</p>
            <p>Amount: {totalAmount}/- INR</p>
            <p>Error: {errorMessage}</p>
          </div>
          <p>Sorry, your payment could not be processed. Please try again.</p>
        </div>
      </div>
    </>
  );
};

export default PaymentFailure;
