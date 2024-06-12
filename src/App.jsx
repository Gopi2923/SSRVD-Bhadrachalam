import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import WelcomePage from "./Components/WelcomePage/WelcomePage";
import SevaList from "./Components/SevasList/SevaList";
import SubSevaList from './Components/SubSevaList/SubSevaList';
import SevaDetailsForm from './Components/SevaDetailsForm/SevaDetailsForm';

function App() {
  const [sevas, setSevas] = useState([]);

  const handleFetchSevas = async () => {
    try {
      const params = { getServices: true };
      const response = await axios.get('http://localhost:3501/sevas', { params });
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
        <Route path='/sevaDetails/:subSevaId' element={<SevaDetailsForm />} />
      </Routes>
    </Router>
  );
}

export default App;
