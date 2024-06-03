// App.js
import React, { useState } from 'react';
import WelcomePage from "./Components/WelcomePage/WelcomePage";
import SevasList from "./Components/SevasList/SevaList";

function App() {
  const [sevas, setSevas] = useState([]);

  const handleClick = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await response.json();
      setSevas(data);
    } catch (error) {
      console.error('Error fetching sevas:', error);
    }
  };

  return (
    <>
      <WelcomePage handleClick={handleClick} />
      <SevasList sevas={sevas} />
    </>
  );
}

export default App;
