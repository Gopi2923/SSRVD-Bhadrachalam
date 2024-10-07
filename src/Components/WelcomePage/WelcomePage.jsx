import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';
import { TailSpin } from 'react-loader-spinner';
import logo from '../../assets/logo.png';
import arrowIcon from '../../assets/arrow_icon.png'

const WelcomePage = ({ handleClick }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleButtonClick = async () => {
    setLoading(true);
    setErrorMessage('');

    const fetchSevasWithTimeout = async () => {
      try {
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 10000)
        );
        await Promise.race([handleClick(), timeout]);
        navigate('/sevas');
      } catch (error) {
        setErrorMessage('Loading sevas is taking longer than expected. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSevasWithTimeout();
  };

  return (
    <div className="Welcome-page">
      <img src={logo} alt="Temple Logo" className="logo" />
      <h1>SREE SEETHAARAMACHANDRA SWAMY<br /> VAARI DEVASTHANAM - Bhadrachalam</h1>
      <h2 className='telugu-title'>శ్రీ సీతారామచంద్ర స్వామి వారి దేవస్థానం</h2>
      <h3 className='telugu-title2'>భద్రాచలం, భద్రాద్రి కొత్తగూడెం జిల్లా</h3>
      <button onClick={handleButtonClick} className="welcome-btn" disabled={loading}>
        {loading ? <> <span>Loadingg...</span>  <TailSpin color="#fff" height={34} width={44}/> </>: 'Click here to get tickets'}
        {!loading && <img src={arrowIcon} alt="" />}
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default WelcomePage;
