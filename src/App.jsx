import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import WelcomePage from "./Components/WelcomePage/WelcomePage";
import SevaList from './Components/SevasList/Sevalist';
import SubSevaList from './Components/SubSevaList/SubSevaList';
import SevaDetailsForm from './Components/SevaDetailsForm/SevaDetailsForm';
import PaymentSuccess from './Components/PaymentSuccessPage/PaymentSuccess';
import PaymentFailure from './Components/PaymentFailure/PaymentFailure';

function App() {
  const [sevas, setSevas] = useState([]);

  const handleFetchSevas = async () => {
    try {
      const params = { getServices: true };
      const response = await axios.get('https://ssrvd.onrender.com/sevas', { params });
      const data = response.data;
      setSevas(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching sevas:', error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage handleClick={handleFetchSevas} />} />
        <Route path="/sevas" element={<SevaList sevas={sevas} />} />
        <Route path="/subSevas/:sevaId" element={<SubSevaList />} />
        <Route path='/checkout' element={<SevaDetailsForm />} />
        <Route path='/paymentsuccess' element={<PaymentSuccess />} />
        <Route path='/paymentfailure' element={<PaymentFailure />} />
      </Routes>
    </Router>
  );
}

export default App;
