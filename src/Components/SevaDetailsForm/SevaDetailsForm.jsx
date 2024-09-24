import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { TailSpin } from 'react-loader-spinner';
import arrow_icon from './../../assets/arrow_icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import './SevaDetailsForm.css';

const SevaDetailsForm = () => {
  const { state } = useLocation();
  const location = useLocation();
  const { cart } = state || { cart: [] };

  // Check if all items in the cart have a limitation of '1'
  const hasOnlyLimitationOne = cart.every(item => item.limitation === '1');
  const hasLimitationZeroAndOne = cart.some(item => item.limitation === '0') && cart.some(item => item.limitation === '1');

  const [formData, setFormData] = useState({
    name: hasOnlyLimitationOne ? 'Gopi' : '',
    mobileNumber: hasOnlyLimitationOne ? '1234567890' : '',
  });

  const [loading, setLoading] = useState(false);
  const [upiLink, setUpiLink] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  // const [countdown, setCountdown] = useState(120);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    let timeout;
    if (transactionId && !paymentSuccess) {
      interval = setInterval(() => checkPaymentStatus(transactionId), 3000); // Poll every 3 seconds

      // Stop checking after 2 minutes (120000 ms)
      timeout = setTimeout(() => {
        clearInterval(interval);
        if (!paymentSuccess) {
          setPaymentFailed(true); // Mark as payment failed
        }
      }, 120000); // 2 minutes timeout
    }
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      if (!paymentSuccess && !paymentFailed) {
        localStorage.removeItem('cart'); // Clear cart if navigating without retry
      }
    };
  }, [transactionId, paymentSuccess, paymentFailed]);

   // Update countdown every second
  // useEffect(() => {
  //   let timer;
  //   if (upiLink && countdown > 0) {
  //     timer = setInterval(() => {
  //       setCountdown(prevCountdown => prevCountdown - 1);
  //     }, 1000);
  //   } else if (countdown === 0 && !paymentSuccess) {
  //     setPaymentFailed(true); // Timeout if countdown reaches 0
  //   }
  //   return () => clearInterval(timer);
  // }, [upiLink, countdown, paymentSuccess])

  const checkPaymentStatus = async (transactionId) => {
    try {
      const response = await axios.get(`https://ssrvd.onrender.com/payment-gateway/paymentStatus/${transactionId}`);
      if (response.data.data.success === true) {
        setPaymentSuccess(true);
        navigate('/paymentsuccess', { state: { transactionId: response.data.data.transaction_id, totalAmount: calculateTotalAmount(), cart } }); // Redirect to paymentSuccess page
        localStorage.removeItem('cart');
  
         // Construct the payload for the POST request
      //  const statusUpdatePayload = {
      //   updateBookingStatus: true,
      //   order_id: orderId,
      //   transaction_no: transactionId,
      //   status: 'success'
      // };

      // // Make the POST request with the appropriate headers
      // const statusUpdateResponse = await axios.post('https://ssrvd.onrender.com/payment-gateway/updateBhadhraChalam', statusUpdatePayload, {
      //   headers: {
      //     'Apikey': 'a9e0f8a33497dbe0de8ea0e154d2a090',
      //     'Content-Type': 'application/json',
      //     'Ver': '1.0',
      //   },
      // });
  
      //   console.log('Status update response:', statusUpdateResponse.data);
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
      setTransactionId(orderId);

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

      if(receiptResponse){
        let body = {
          order_id: receiptResponse.data.order_id
        }
        console.log("body",body)
        const transactionResponse = await axios.post('https://ssrvd.onrender.com/payment-gateway/generatePaymentLink', body, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log("transactionResponse",transactionResponse)
        console.log("transactionResponse.data.short_url",transactionResponse.data.short_url)
        const  upi_intent_link  = transactionResponse.data.paymentLink.short_url;
        setUpiLink(upi_intent_link);
        console.log(upi_intent_link)
        setLoading(false);
      }
      // const transactionId = await axios.post('https://ssrvd.onrender.com/payment-gateway/getTransactionId', body, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });
     
      // console.log("transactionId.transaction_id",transactionId.transaction_id)
      // setTransactionId(transactionId.transaction_id);

      // Third API call to update the transactionId and orderId
      // await axios.post('https://ssrvd.onrender.com/payment-gateway/update/transactionId/orderId', {
      //   order_id: orderId,
      //   transaction_id: transaction_id
      // }, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });

      // localStorage.removeItem('cart');
      setLoading(false);
    } catch (error) {
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  const retryPayment = () => {
    setPaymentFailed(false);
    setTransactionId(''); // Reset transaction ID
    setUpiLink(''); // Reset UPI link
    handleSubmit(); // Retry the payment
  };


  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  return (
    <div className='seva-details'>
      <button className='back-button' onClick={() => navigate(-1)}>
        <img src={arrow_icon} alt="back" className='rotate-left' />
        Back
      </button>
      {!upiLink ? (
        <form className="seva-details-form" onSubmit={handleSubmit}>
          {!(hasOnlyLimitationOne && !hasLimitationZeroAndOne) && (
            <>
            <h1>Devotee Details</h1>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} pattern="[A-Za-z\s]+"
                  title="Please enter only letters" required />
              </div>
              <div className="form-group">
                <label htmlFor="mobileNumber">Mobile Number:</label>
                <input type="tel" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} pattern="\d{10}"
                  title="Please enter exactly 10 digits" required />
              </div>
            </>
          )}
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
            {paymentFailed ? (
            <>
             <div className="payment-failure">
        <div>
          <h1>Payment Failed</h1>
          <FontAwesomeIcon icon={faTimesCircle} size="3x" style={{ color: 'red', margin: '10px 0' }} />
          <div className="payment-details">
            <p>Payment ID: {transactionId}</p>
            <p>Amount: {calculateTotalAmount()}/- INR</p>
            <p>Error: {'Time Out'}</p>
          </div>
          <p>Sorry, your payment could not be processed. Please try again.</p>
          <button onClick={retryPayment} className='try-again-btn'>Try Again</button>
        </div>
      </div>
              {/* <h2>Payment Timeout</h2> */}
             
            </>
          ) : (
            <>
          <div className="qr-code-card">
          {/* <p>Time Remaining: {Math.floor(countdown / 60)}:{('0' + (countdown % 60)).slice(-2)} minutes</p> */}
            <h2>Total Amount: {calculateTotalAmount()} /-</h2>
            <h2>Scan to Pay</h2>
            <QRCode value={upiLink} size={256} />
          </div>
          </>
          )}
        </div>
      )}
    </div>
  );
};

export default SevaDetailsForm;
