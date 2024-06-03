// src/api.js
export const fetchSevas = async () => {
    try {
      const response = await fetch('https://bhadradritemple.telangana.gov.in/apis/api.php');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching sevas:', error);
      throw error;
    }
  };
  