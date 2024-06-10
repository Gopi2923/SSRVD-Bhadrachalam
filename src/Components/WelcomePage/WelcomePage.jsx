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
      <h2 className='telugu-title'>శ్రీ సీతారామచంద్ర స్వామి వారి దేవస్థానం</h2>
      <h3 className='telugu-title2'>భద్రాచలం, భద్రాద్రి కొత్తగూడెం జిల్లా</h3>
      <button onClick={handleButtonClick} className="welcome-btn">
        Click here to get tickets <img src="/src/assets/arrow_icon.png" alt="" />
      </button>
    </div>
  );
};

export default WelcomePage;
