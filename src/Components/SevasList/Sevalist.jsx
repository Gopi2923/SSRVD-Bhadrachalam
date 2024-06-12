import React from 'react';
import { useNavigate } from 'react-router-dom';
import arrow_icon from '../../assets/arrow_icon.png';
import './SevaList.css';

const SevaList = ({ sevas }) => {
  const navigate = useNavigate();

  const handleSevaClick = (seva) => {
    if (!(seva.isSpecialSeva && seva.SubSevas && seva.SubSevas.length === 0)) {
      console.log(`Navigating to /subSevas/${seva.id}`);
      navigate(`/subSevas/${seva.id}`);
    }
  };

  return (
    <div className="sevas-list-page">
      <button className="back-button" onClick={() => navigate('/')}>
        <img src={arrow_icon} alt="Back" className="rotate-left" /> Back
      </button>
      <div className="sevas-list">
      {sevas.data && sevas.data.map((seva, index) => (
          <div
            key={index}
            className={`seva-card ${(seva.isSpecialSeva && seva.SubSevas && seva.SubSevas.length === 0) ? 'disabled' : ''}`}
            onClick={() => handleSevaClick(seva)}
            style={{ cursor: (seva.isSpecialSeva && seva.SubSevas && seva.SubSevas.length === 0) ? 'not-allowed' : 'pointer' }}
          >
            <img src="/src/assets/sevaimg.jpg" alt="Seva" />
            <h3> {seva.seva_type}</h3>
            <p>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SevaList;
