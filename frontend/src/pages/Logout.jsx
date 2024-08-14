import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('https://twitter-clone-fu8e.onrender.com/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('user'); // Remove user data from local storage
      sessionStorage.removeItem('userId');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <button onClick={handleLogout}>
      Log Out
    </button>
  );
}

export default Logout;
