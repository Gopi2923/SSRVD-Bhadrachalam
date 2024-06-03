import React from 'react';
import './SevaList.css';

const SevasList = ({ sevas }) => {
  return (
    <div className="sevas-list">
      {sevas.map((seva, index) => (
        <div key={index} className="seva-card">
          <h3>{seva.title}</h3>
          <p>{seva.body}</p>
          <p>Price: {seva.id}</p>
        </div>
      ))}
    </div>
  );
};

export default SevasList;
