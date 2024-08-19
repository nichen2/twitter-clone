import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';  

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await axios.post('https://twitter-clone-fu8e.onrender.com/auth/signup', {
        username,
        email,
        password,
      }, {
        withCredentials : true,
      });
      console.log('Signup successful', response.data);
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      console.error('Signup failed', error);
      setError('Signup failed. Please try again. Username already exists');
    }
  };

  return (
    <div className='signup-container'> 
      <form onSubmit={handleSignup}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    
  );
}

export default Signup;
