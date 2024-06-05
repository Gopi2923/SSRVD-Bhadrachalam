// src/Components/SubSevasList/SubSevasList.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import arrow_icon from '../../assets/arrow_icon.png';
import './SubSevaList.css';

const SubSevasList = () => {
  const { sevaId } = useParams();
  const [subSevas, setSubSevas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubSevas = async () => {
      try {
        const response = await axios.get(`http://localhost:3501/sub-sevas/allSubsevas/${sevaId}`);
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
        {subSevas.map((subSeva, index) => (
          <div key={index} className="sub-seva-card">
            <h3>{subSeva.sevaId}. {subSeva.subSevaName}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubSevasList;
