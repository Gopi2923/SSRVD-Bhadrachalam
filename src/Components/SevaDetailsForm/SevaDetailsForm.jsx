import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import './SevaDetailsForm.css';

const SevaDetailsForm = () => {
  const { state } = useLocation();
  const { cart } = state;
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    goutram: '',
  });
  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState(null);
  const [qrCode, setQrCode] = useState(null);
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
      goutram: formData.goutram,
      bookingdata: bookingData,
      total_amount: calculateTotalAmount(),
      booking_date: new Date().toLocaleDateString('en-GB'),
    };

    console.log('Submitting form with data:', payload);

    try {
      const response = await axios.post('http://localhost:3501/user-reciept/createReciept', payload);
      console.log('Response:', response.data);

      localStorage.removeItem('cart');

      const paymentResponse = await axios.post('http://localhost:3501/payment/create', { amount: payload.total_amount });
      setPaymentLink(paymentResponse.data.paymentLink);
      setQrCode(paymentResponse.data.qrCode);

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
        <div className="form-group">
          <label htmlFor="goutram">Goutram:</label>
          <input type="text" id="goutram" name="goutram" value={formData.goutram} onChange={handleChange} required />
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
        <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Processing...' : 'Make Payment'}</button>
      </form>
      {qrCode && (
        <div className="qr-code">
          <h2>Scan to Pay</h2>
          <QRCode value={qrCode} />
        </div>
      )}
    </div>
  );
};

export default SevaDetailsForm;
