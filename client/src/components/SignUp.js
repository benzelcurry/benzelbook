// Sign-up component

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Nav from './Nav';
import Footer from './Footer';
import '../stylesheets/SignUp.css';

const SignUp = () => {
  const [photo, setPhoto] = useState('');
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

  const handlePhoto = (e) => {
    setPhoto(e.target.files[0]);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstName.length === 0) {
      return setError('Please enter a first name');
    };
    if (familyName.length === 0) {
      return setError('Please enter a family name');
    };
    if (username.length === 0) {
      return setError('Please enter a username');
    };
    if (password.length === 0) {
      return setError('Password field must not be blank');
    };
    if (confPass.length === 0) {
      return setError('Confirm password field must not be blank');
    };
    const body = new FormData();
    body.append('first_name', firstName);
    body.append('family_name', familyName);
    body.append('pfp', photo);
    body.append('username', username);
    body.append('password', password);
    body.append('confirm_password', confPass);
    axios.post(`${process.env.REACT_APP_SERVER_URL}/users`, body)
      .then((response) => {
        if (response.data.errors) {
          if (typeof(response.data.errors[0]) === 'object') {
            return setError(response.data.errors[0].msg);
          } else {
            return setError(response.data.errors[0]);
          }
        }
        axios.post(`${process.env.REACT_APP_SERVER_URL}/login`, { username: username, password: password })
          .then((response) => {
            if (response.data.message === 'Successful') {
              window.localStorage.setItem('token', response.data.token);
              navigate('/');
            }
          })
          .catch((err) => {
            throw new Error(err);
          });
      });
  };

  return (
    <div>
      <Nav newUser={true} />
      <div className="signup-container">
        <form action="" method="POST" className='signup-form' encType='multipart/form-data' >
          <div className="signup-inputs">
            <label htmlFor="photo">Profile Picture: </label>
            <input type="file" accept='.png, .jpg, .jpeg' name='photo' id='photo'
              onChange={(e) => handlePhoto(e)} className='pfp-input' />

            <label htmlFor="first_name">First Name*: </label>
            <input type="text" name='first_name' id='first_name' placeholder='First Name' 
              onChange={(e) => handleFirst(e)}
            />
            
            <label htmlFor="family_name">Family Name*: </label>
            <input type="text" name='family_name' id='family_name' placeholder='Family Name' 
              onChange={(e) => handleFamily(e)}
            />

            <label htmlFor="username">Username*: </label>
            <input type="text" name='username' id='username' maxLength={16}
              placeholder='Username (16 char max)' onChange={(e) => handleUser(e)}
            />

            <label htmlFor="password">Password*: </label>
            <input type="password" name='password' id='password' placeholder='Password' 
              onChange={(e) => handlePass(e)}
            />

            <label htmlFor="confirm_password">Confirm Password*: </label>
            <input type="password" name='confirm_password' id='confirm_password' placeholder='Confirm Password' 
              onChange={(e) => handleConf(e)}
            />

            <p className='required-message'>* required</p>
          </div>

          <button className='signup-form-btn' onClick={(e) => handleSubmit(e)}>Sign Up</button>
        </form>
        { error ? 
          <div className="error-msg">{error}</div> 
          : null 
        }
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;