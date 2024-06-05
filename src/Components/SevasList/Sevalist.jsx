// src/Components/SevasList/SevasList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import arrow_icon from '../../assets/arrow_icon.png';
import './SevaList.css';

const SevasList = ({ sevas }) => {
  const navigate = useNavigate();

  const handleSevaClick = (sevaId) => {
    console.log(`Navigating to /sevas/${sevaId}`);
    navigate(`/subSevas/${sevaId}`);
  };

  return (
    <div className="sevas-list-page">
      <button className="back-button" onClick={() => navigate('/')}>
        <img src={arrow_icon} alt="Back" className="rotate-left" /> Back
      </button>
      <div className="sevas-list">
        {sevas.data && sevas.data.map((seva, index) => (
          <div key={index} className="seva-card" onClick={() => handleSevaClick(seva._id)}>
            <img src="/src/assets/sevaimg.jpg" alt="Seva" />
            <h3>{seva.sevaId}. {seva.sevaName}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SevasList;
