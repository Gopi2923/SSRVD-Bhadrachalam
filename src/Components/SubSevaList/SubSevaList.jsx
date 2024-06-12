import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import arrow_icon from '../../assets/arrow_icon.png';
import './SubSevaList.css';

const SubSevaList = () => {
  const { sevaId } = useParams();
  const [subSevas, setSubSevas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`Fetching sub-sevas for sevaId: ${sevaId}`);
    const fetchSubSevas = async () => {
      setLoading(true);  // Start loading
      try {
        const params = {
          "getsubServices":true,
          "seva_type":sevaId
      };
        const response = await axios.get('http://localhost:3501/sub-sevas', { params });
        console.log('Fetched sub-sevas:', response.data);
        setSubSevas(response.data);
      } catch (error) {
        console.error('Error fetching sub-sevas:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchSubSevas();
  }, [sevaId]);

  const handleSubSevaClick = (subSeva) => {
    navigate(`/sevaDetails/${subSeva._id}`, { state: { subSeva, parentSevaId: sevaId } });
  };

  return (
    <div className="sub-sevas-list-page">
      <button className="back-button" onClick={() => navigate('/sevas')}>
        <img src={arrow_icon} alt="Back" className="rotate-left" /> Back
      </button>
      <div className="sub-sevas-list">
        {loading ? (
          <p>Loading...</p>
        ) : subSevas.data && subSevas.data.length > 0 ? (
          subSevas.data.map((subSeva, index) => (
            <div key={index} className="sub-seva-card" onClick={() => handleSubSevaClick(subSeva)}>
              <img src={subSeva.image} alt="Seva" />
              <h3>{subSeva.sevaId} {subSeva.seva_english_name}</h3>
              <h3>{subSeva.sevaId} {subSeva.seva_telugu_name}</h3>
              <p>Price: {subSeva.price} /-</p>
              <button className='booknow-btn'>Book Now</button>
            </div>
          ))
        ) : (
          <p className='notavailable'>No Sevas available</p>
        )}
      </div>
    </div>
  );
};

export default SubSevaList;
