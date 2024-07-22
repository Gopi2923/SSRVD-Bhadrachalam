import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import printJS from 'print-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/logo.png'
import arrowIcon from '../../assets/arrow_icon.png'
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transactionId, totalAmount, cart } = location.state || {};

  const printTicket = () => {
    const ticketDetails = `
    <div>
      <img src=${logo} alt="Temple logo" className="temple-logo" style="display: block; margin: 0 auto;"/>
      <h3>Purchased Tickets</h3>
      <ul>
        ${cart && cart.length > 0 ? cart.map(item => `
          <li>
            ${item.seva_english_name} - ${item.quantity} x ${item.price} = ${item.quantity * item.price} /-
          </li>`).join('') : ''}
      </ul>
      <h3>Payment Successful</h3>
      <p>Transaction ID: ${transactionId}</p>
      <p>Total Amount Paid: ${totalAmount} INR</p>
    </div>
  `;
  printJS({ printable: ticketDetails, type: 'raw-html' });
  
  };

  return (
    <>
      <button className="back-button" onClick={() => navigate("/")}>
        <img src={arrowIcon} alt="" className="rotate-left" />
        Back
      </button>
      <div className="payment-success">
        <div>
          <h1>Payment Successful</h1>
          <FontAwesomeIcon icon={faCheckCircle} size="3x" style={{ color: 'green', margin: '10px 0' }} />
          <div className="payment-details">
            <p>Payment ID: {transactionId}</p>
            <p>Amount: {totalAmount}/- INR</p>
          </div>
          <button className="print-button" onClick={printTicket}>
            Print Your Tickets
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
