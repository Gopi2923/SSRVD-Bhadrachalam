import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import WelcomePage from "./Components/WelcomePage/WelcomePage";
import SevasList from "./Components/SevasList/SevaList";
import SevaDetailsForm from './Components/SevaDetailsForm/SevaDetailsForm';
import SubSevasList from './Components/SubSevaList/SubSevaList';

function App() {
  const [sevas, setSevas] = useState([]);

  const handleFetchSevas = async () => {
    try {
      const response = await axios.get('http://localhost:3501/sevas');
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
        <Route path="/sevas" element={<SevasList sevas={sevas} />} />
        <Route path="/sevadetails" element={<SevaDetailsForm />} />
        <Route path='/subSavas/:sevaId' element={<SubSevasList />} />
      </Routes>
    </Router>
  );
}

export default App;
