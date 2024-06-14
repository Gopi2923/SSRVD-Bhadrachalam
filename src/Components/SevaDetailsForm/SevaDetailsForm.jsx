import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SevaDetailsForm.css';

const SevaDetailsForm = () => {
  const { state } = useLocation();
  const { cart } = state;
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    address: '',
  });

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
    const payload = {
      ...formData,
      cart,
    };
    console.log('Submitting form with data:', payload);
    try {
      const response = await axios.post('http://localhost:3501/user-reciept/create', payload);
      console.log('Response:', response.data);
      navigate('/confirmation', { state: { receipt: response.data } });
    } catch (error) {
      console.error('Error submitting form:', error);
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
        <button type="submit" className="submit-btn">Make Payment</button>
      </form>
    </div>
  );
};

export default SevaDetailsForm;
