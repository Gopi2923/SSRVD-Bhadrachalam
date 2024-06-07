import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SevaDetailsForm.css';

const SevaDetailsForm = () => {
  const { state } = useLocation();
  const { subSeva } = state;
  const [formData, setFormData] = useState({
    subSevaName: subSeva.sevaName,
    sevaId: subSeva._id,
    name: '',
    mobileNumber: '',
    parentSevaRef: subSeva.parentSevaRef,
    parentSevaName: subSeva.parentSevaName,
    noOfTickets: 1,
    price: subSeva.price,
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
      mobileNumber: Number(formData.mobileNumber),
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
    return formData.noOfTickets * formData.price;
  };

  return (
    <div>
      <button className='back-button' onClick={() => navigate('/subSevas')}>
        <img src="/src/assets/arrow_icon.png" alt="" className='rotate-left' />
        Back
      </button>
      <form className="seva-details-form" onSubmit={handleSubmit}>
        <h1>Devotee Details</h1>
        <div className="form-group">
          <label htmlFor="templeName">Temple Name:</label>
          <input type="text" id="templeName" name="templeName" value="Sree Seetha Ramachandra Swamy vaari Devasthanam" readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number:</label>
          <input type="tel" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="noOfTickets">No of Tickets:</label>
          <input type="number" id="noOfTickets" name="noOfTickets" value={formData.noOfTickets} onChange={handleChange} min="1" required />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input type="text" id="price" name="price" value={formData.price} readOnly />
        </div>
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
