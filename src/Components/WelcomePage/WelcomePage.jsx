import React from 'react';
import './WelcomePage.css';

const WelcomePage = () => {
  const handleClick = () => {
    alert('Button clicked! Starting ticket process...');
    // Add your ticket process logic here
  };

  return (
    <div className="Welcome-page">
      <h1>SREE SEETHAARAMACHANDRA SWAMY VAARI DEVASTHANAM - Bhadrachalam</h1>
      <button onClick={handleClick} className='welcome-btn'>Click here to get tickets</button>
    </div>
  );
};

export default WelcomePage;
