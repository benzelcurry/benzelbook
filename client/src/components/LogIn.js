// Log-In Component

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Nav from './Nav';
import Footer from './Footer';
import '../stylesheets/LogIn.css';

const LogIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleUser = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.length === 0) {
      return setError('Please enter a username');
    };
    if (password.length === 0) {
      return setError('Please enter a password');
    };
    const body = { username: username, password: password };
    axios.post(`${process.env.REACT_APP_SERVER_URL}/login`, body)
      .then((response) => {
        if (response.data.message === 'Successful') {
          window.localStorage.setItem('token', response.data.token);
          navigate('/');
        } else {
          setError(response.data.error);
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  return (
    <div>
      <Nav newUser={true} />
      <div className="login-container">
        <form action="" method="POST" className="login-form">
          <div className="form-inputs">
            <label htmlFor="username">Username: </label>
            <input type="text" name="username" id="username" placeholder="Username" 
              onChange={(e) => handleUser(e)}
            />

            <label htmlFor="password">Password: </label>
            <input type="password" name="password" id="password" placeholder="Password" 
              onChange={(e) => handlePassword(e)}
            />
          </div>
          { error ? 
          <div className="error-msg">{error}</div> 
          : null 
          }
          <button className='login-form-btn' onClick={(e) => handleSubmit(e)}>Log In</button>
        </form>
        <Link to={'/signup'} className='no-account-msg'>
          <p>Don't have an account? Sign up now!</p>
        </Link>
        <button className='guest-login-btn'>Proceed As Guest</button>
      </div>
      <Footer />
    </div>
  );
};

export default LogIn;