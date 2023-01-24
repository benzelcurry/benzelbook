import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Nav from './Nav';
import Footer from './Footer';
import '../stylesheets/SignUp.css';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confPass, setConfPass] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleFirst = (e) => {
    setFirstName(e.target.value);
  };
  
  const handleFamily = (e) => {
    setFamilyName(e.target.value);
  };

  const handleUser = (e) => {
    setUsername(e.target.value);
  };

  const handlePass = (e) => {
    setPassword(e.target.value);
  };

  const handleConf = (e) => {
    setConfPass(e.target.value);
  };

  return (
    <div>
      <Nav />
      <div className="signup-container">
        <form action="" method="POST" className='signup-form'>
          <div className="signup-inputs">
            <label htmlFor="first_name">First Name: </label>
            <input type="text" name='first_name' id='first_name' placeholder='First Name' 
              onChange={(e) => handleFirst(e)}
            />
            
            <label htmlFor="family_name">Family Name: </label>
            <input type="text" name='family_name' id='family_name' placeholder='Family Name' 
              onChange={(e) => handleFamily(e)}
            />

            <label htmlFor="username">Username: </label>
            <input type="text" name='username' id='username' placeholder='Username' 
              onChange={(e) => handleUser(e)}
            />

            <label htmlFor="password">Password: </label>
            <input type="password" name='password' id='password' placeholder='Password' 
              onChange={(e) => handlePass(e)}
            />

            <label htmlFor="confirm_password">Confirm Password: </label>
            <input type="confirm_password" name='confirm_password' id='confirm_password' placeholder='Confirm Password' 
              onChange={(e) => handleConf(e)}
            />
          </div>

          <button className='signup-form-btn'>Sign Up</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;