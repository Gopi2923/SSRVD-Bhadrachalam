import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';
import logo from '../../assets/logo.png';

const WelcomePage = ({ handleClick }) => {
  const navigate = useNavigate();

  const handleButtonClick = async () => {
    await handleClick();
    navigate('/sevas');
  };

  return (
    <div className="Welcome-page">
      <img src={logo} alt="Temple Logo" className="logo" />
      <h1>SREE SEETHAARAMACHANDRA SWAMY<br /> VAARI DEVASTHANAM - Bhadrachalam</h1>
      <button onClick={handleButtonClick} className="welcome-btn">
        Click here to get tickets
      </button>
    </div>
  );
};

export default WelcomePage;
