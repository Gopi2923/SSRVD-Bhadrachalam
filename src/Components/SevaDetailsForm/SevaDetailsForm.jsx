import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SevaDetailsForm.css';

const SevaDetailsForm = () => {
  const { state } = useLocation();
  const { cart } = state;
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    // goutram: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'mobileNumber' ? value.replace(/\D/g, '') : value,
    });
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
      // goutram: formData.goutram,
      bookingdata: bookingData,
      total_amount: calculateTotalAmount(),
      booking_date: new Date().toLocaleDateString('en-GB'),
    };

    try {
      await axios.post('https://ssrvd.onrender.com/user-reciept/createReciept', payload);

      localStorage.removeItem('cart');

      await checkoutHandler(payload.total_amount);
      setLoading(false);
    } catch (error) {
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const checkoutHandler = async (total_amount) => {
    try {
        const { data: keyResponse } = await axios.get("https://ssrvd.onrender.com/payment-gateway/key");
        console.log('Key Response:', keyResponse);

        const { data: orderResponse } = await axios.post("https://ssrvd.onrender.com/payment-gateway/create/orderitem", {
            amount: total_amount * 100,  // Razorpay requires amount in paise
            currency: "INR"
        });
        console.log('Order Response:', orderResponse);

        const order = orderResponse.data;

        const options = {
            key: keyResponse.key,
            amount: order.amount,
            currency: "INR",
            name: "Seva Booking",
            description: "Seva booking payment",
            image: "https://avatars.githubusercontent.com/Gopi2923",
            order_id: order.id,
            callback_url: "https://ssrvd.onrender.com/payment-gateway/payment/verify",
            prefill: {
                name: formData.name,
                email: "example@example.com",
                contact: formData.mobileNumber
            },
            notes: {
                "address": "Devotee Address"
            },
            theme: {
                "color": "#121212"
            },
            handler: function(response) {
                // Handle success
                console.log('Payment success:', response);
                navigate('/paymentsuccess', { state: { paymentDetails: response } });
            },
            modal: {
                ondismiss: function() {
                    console.log("Payment popup closed");
                }
            }
        };

        if (window.Razorpay) {
            const razor = new window.Razorpay(options);
            razor.open();
        } else {
            console.error('Razorpay SDK is not available');
        }
    } catch (error) {
        console.error('Error initiating payment:', error.response ? error.response.data : error.message);
    }
};

  
  
  
  

  return (
    <div className='seva-details'>
      <button className='back-button' onClick={() => navigate(-1)}>
        <img src="/src/assets/arrow_icon.png" alt="" className='rotate-left' />
        Back
      </button>
      <form className="seva-details-form" onSubmit={handleSubmit}>
        <h1>Devotee Details</h1>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number:</label>
          <input type="tel" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
        </div>
        {/* <div className="form-group">
          <label htmlFor="goutram">Goutram:</label>
          <input type="text" id="goutram" name="goutram" value={formData.goutram} onChange={handleChange} required />
        </div> */}
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
        <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Processing...' : 'Make Payment'}</button>
      </form>
    </div>
  );
};

export default SevaDetailsForm;
