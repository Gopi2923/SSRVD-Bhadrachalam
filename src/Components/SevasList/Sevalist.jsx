import React from 'react';
import { useNavigate } from 'react-router-dom';
import arrow_icon from '../../assets/arrow_icon.png'
import './SevaList.css';

const SevasList = ({ sevas }) => {
  const navigate = useNavigate();

  return (
    <div className="sevas-list-page">
      <button className="back-button" onClick={() => navigate('/')}>
        <img src={arrow_icon} alt="" className="rotate-left" /> Back
      </button>
      <div className="sevas-list">
         {sevas.data && sevas.data.map((seva, index) => (
          <div key={index} className="seva-card">
            <img src="/src/assets/sevaimg.jpg" alt="" />
            <h3>{seva.sevaId} {". "}{seva.sevaName}</h3>
            <p>Price: ₹{seva.price}/-</p> 

            <button className='booknow-btn'>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SevasList;
