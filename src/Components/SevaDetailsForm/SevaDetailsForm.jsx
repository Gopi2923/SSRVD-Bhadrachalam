import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { TailSpin } from 'react-loader-spinner';
import './SevaDetailsForm.css';

const SevaDetailsForm = () => {
  const { state } = useLocation();
  const { cart } = state;
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [upiLink, setUpiLink] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    let timeout;
    if (transactionId && !paymentSuccess) {
      interval = setInterval(() => checkPaymentStatus(transactionId), 3000); // Poll every 5 seconds

    //Stop checking after 5 minutes (300000 ms)
    timeout = setTimeout(() => {
      clearInterval(interval);
      if(!paymentSuccess) {
       navigate('/paymentfailure', {
        state: {
          transactionId,
          totalAmount: calculateTotalAmount(),
          errorMessage: 'Payment timed out. Please try again'
        }
       });
      }
    }, 120000);
  }
    return () => {
      clearInterval(interval);
      clearTimeout(timeout)
    };
  }, [transactionId, paymentSuccess]);

  const checkPaymentStatus = async (transactionId) => {
    try {
      const response = await axios.get(`https://ssrvd.onrender.com/payment-gateway/paymentStatus/${transactionId}`);
      if (response.data.data === true) {
        setPaymentSuccess(true);
        navigate('/paymentsuccess', { state: { transactionId: transactionId, totalAmount: calculateTotalAmount(), cart }}); // Redirect to paymentSuccess page
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      const cleanedValue = value.replace(/[^a-zA-Z\s]/g, ''); // Remove non-letter characters
      setFormData({
        ...formData,
        [name]: cleanedValue,
      });
    } else if (name === 'mobileNumber') {
      const cleanedValue = value.replace(/\D/g, ''); // Remove non-digit characters
      if (cleanedValue.length <= 10) {
        setFormData({
          ...formData,
          [name]: cleanedValue,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bookingData = cart.map(item => ({
      service_id: Number(item.service_id),
      quantity: Number(item.quantity),
      price: Number(item.price),
      total: item.quantity * item.price,
    }));

    const payload = {
      SubmitSevaBooking: true,
      name: formData.name,
      mobileNumber: formData.mobileNumber,
      bookingdata: bookingData,
      total_amount: calculateTotalAmount(),
      booking_date: new Date().toLocaleDateString('en-GB'),
    };

    try {
      // First API call to create the receipt and get the order_id
      const receiptResponse = await axios.post('https://ssrvd.onrender.com/user-reciept/createReciept', payload);
      const orderId = receiptResponse.data.order_id;

      // Second API call to create the transaction with the received order_id
      const token = '367|qM5tv66Rhk8Tm13DlvDkc92KNwVMvAhOuljLB8tA';
      const transactionData = {
        amount: '1',
        description: 'laddu',
        name: formData.name,
        email: 'dhanushnm07@gmail.com',
        mobile: Number(formData.mobileNumber),
        enabledModesOfPayment: 'upi',
        payment_method: 'UPI_INTENT',
        source: 'api',
        order_id: orderId, // Use the order_id received from the create receipt API
        user_uuid: 'swp_sm_903dd099-3a9e-4243-ac1e-f83f83c30725',
        other_info: 'api',
        encrypt_response: 0
      };

      const formData2 = new FormData();
      for (const key in transactionData) {
        formData2.append(key, transactionData[key]);
      }

      const transactionResponse = await axios.post('https://www.switchpay.in/api/createTransaction', formData2, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const { upi_intent_link, transaction_id } = transactionResponse.data;
      setUpiLink(upi_intent_link);
      setTransactionId(transaction_id);

      // Third API call to update the transactionId and orderId
      await axios.post('https://ssrvd.onrender.com/payment-gateway/update/transactionId/orderId', {
        order_id: orderId,
        transaction_id: transaction_id
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // localStorage.removeItem('cart');
      setLoading(false);
    } catch (error) {
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  return (
    <div className='seva-details'>
      <button className='back-button' onClick={() => navigate(-1)}>
        <img src="/src/assets/arrow_icon.png" alt="" className='rotate-left' />
        Back
      </button>
      {!upiLink ? (
        <form className="seva-details-form" onSubmit={handleSubmit}>
          <h1>Devotee Details</h1>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}  pattern="[A-Za-z\s]+"
               title="Please enter only letters" required />
          </div>
          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number:</label>
            <input type="tel" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} pattern="\d{10}"
               title="Please enter exactly 10 digits" required />
          </div>
          <h2>Cart Summary</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.service_id}>
                {item.seva_english_name} - {item.quantity} x {item.price} /- = {item.quantity * item.price} /-
              </li>
            ))}
          </ul>
          <div className="form-group">
            <label htmlFor="totalAmount">Total Amount:</label>
            <input type="text" id="totalAmount" name="totalAmount" value={calculateTotalAmount()} readOnly />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <TailSpin color="#fff" height={24} width={24} />
                <span style={{ marginLeft: '10px' }}>Processing...</span>
              </>
            ) : (
              'Make Payment'
            )}
          </button>
        </form>
      ) : (
        <div className="qr-code-container">
           <div className="qr-code-card">
            <h2>Total Amount: {calculateTotalAmount()} /-</h2>
            <h2>Scan to Pay</h2>
            <QRCode value={upiLink} size={256} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SevaDetailsForm;
