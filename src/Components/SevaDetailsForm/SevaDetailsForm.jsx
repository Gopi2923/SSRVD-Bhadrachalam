import React from 'react'
import { useNavigate } from 'react-router-dom'
import './SevaDetailsForm.css'



const SevaDetailsForm = () => {
   
 const navigate = useNavigate();
  return (
    <div>
        <button className='back-button' onClick={() => navigate('/sevas')}>
            <img src="/src/assets/arrow_icon.png" alt="" className='rotate-left'/>
            Back
        </button>
      <h1>Devotees Details</h1>
    </div>
  )
}

export default SevaDetailsForm
