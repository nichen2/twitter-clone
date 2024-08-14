import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from '../pages/Logout.jsx';
import './Navbar.css';

function Navbar() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    setUserId(null); // Update the state to trigger a re-render
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><Link to="/">Home</Link></li>
        {userId ? (
          <>
            <li><Link to={`/profile/${userId}`}>Profile</Link></li>
            <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
