import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://twitter-clone-fu8e.onrender.com/auth/login', {
        email,
        password,
      }, {
        withCredentials : true,
      });
      sessionStorage.setItem('userId', response.data.user.id);
      console.log('Login successful', response.data);
      window.location.href = '/'; // Redirect to the home page
      // Handle successful login, e.g., store token, redirect, etc.
    } catch (error) {
      setError('Invalid email or password.');
      // Handle login error
    }
  };

  return (
    <div className='login-container'>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Log In</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    
  );
}

export default Login;
