import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import arrow_icon from '../../assets/arrow_icon.png';
import './SubSevaList.css';

const SubSevaList = () => {
  const { sevaId } = useParams();
  const [subSevas, setSubSevas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`Fetching sub-sevas for sevaId: ${sevaId}`);
    const fetchSubSevas = async () => {
      try {
        const response = await axios.get(`http://localhost:3501/sub-sevas/allSubsevas/${sevaId}`);
        console.log('Fetched sub-sevas:', response.data);
        setSubSevas(response.data);
      } catch (error) {
        console.error('Error fetching sub-sevas:', error);
      }
    };

    fetchSubSevas();
  }, [sevaId]);

  return (
    <div className="sub-sevas-list-page">
      <button className="back-button" onClick={() => navigate('/sevas')}>
        <img src={arrow_icon} alt="Back" className="rotate-left" /> Back
      </button>
      <div className="sub-sevas-list">
      {subSevas.data && subSevas.data.length > 0 ? (
        subSevas.data.map((subSeva, index) => (
          <div key={index} className="sub-seva-card">
            <img src="/src/assets/sevaimg.jpg" alt="Seva" />
            <h3>{subSeva.sevaId}. {subSeva.sevaName}</h3>
            <p>Price: {subSeva.price} /-</p>
            <button className='booknow-btn'>Book Now</button>
          </div>
        ))
      ) : (
        <p>No sub-sevas available</p>
      )}
      </div>
    </div>
  );
};

export default SubSevaList;