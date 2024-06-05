import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SevaDetailsForm.css'


const SevaDetailsForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
      name: '',
      nameTelugu: '',
      gothram: '',
      gothramTelugu: '',
      address: '',
      email: '',
      mobileNumber: '',
      date: '',
      templeTimings: '',
      noOfTickets: 1,
      price: 100,
    });
  
    console.log(formData)

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };
  
    const calculateTotalAmount = () => {
      return formData.noOfTickets * formData.price;
    };

    const generateQR = () => {

    }
   
 const navigate = useNavigate();
  return (
    <div>
        <button className='back-button' onClick={() => navigate('/sevas')}>
            <img src="/src/assets/arrow_icon.png" alt="" className='rotate-left'/>
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
        <label htmlFor="templeTimings">Seva Timings:</label>
        <select id="templeTimings" name="templeTimings" value={formData.templeTimings} onChange={handleChange} required>
          <option value="">Select Timings</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="date">Date:</label>
        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
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
      <button type="submit" className="submit-btn" onClick={generateQR()} >Make Payment</button>
    </form>
    </div>
  )
}

export default SevaDetailsForm
