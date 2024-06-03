import React from 'react';
import './WelcomePage.css';

const WelcomePage = ({ handleClick }) => {
  return (
    <div className="Welcome-page">
      <h1>SREE SEETHAARAMACHANDRA SWAMY<br></br> VAARI DEVASTHANAM - Bhadrachalam</h1>
      <button onClick={handleClick} className="welcome-btn">
        Click here to get tickets
      </button>
    </div>
  );
};

export default WelcomePage;
