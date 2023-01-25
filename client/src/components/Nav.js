// Nav/Header component

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../stylesheets/Nav.css';

const Nav = () => {
  const [user, setUser] = useState();
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  useEffect(() => {
    const body = { token: localStorage.getItem('token') }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/`, body)
      .then((response) => {
        console.log(response);
        setUser(response.data.name);
      })
  }, [token])

  const handleClick = (e) => {
    localStorage.clear();
    navigate(0);
  }

  return (
    <div className='header'>
      <Link to={'/'} className='nav-link'>
        <button className='site-title'>Benzelbook</button>
      </Link>
      { /* MAKE LOGIN BUTTON CONDITIONALLY DISPLAY ONLY IF USER
        IS LOGGED OUT */ }
      <div className="nav-right">
        { user ?
          <div>
            <button className='nav-btn'>{user}</button>
            <button className='nav-btn' onClick={() => handleClick()}>Log Out</button>
          </div>
          : 
          <div>
            <Link to={'/signup'} className='nav-link'>
              <button className='signup-btn nav-btn'>Sign Up</button>
            </Link>
            <Link to={'/login'} className='nav-link'>
              <button className='login-btn nav-btn'>Log In</button>
            </Link>
          </div>
        }
      </div>
    </div>
  );
};

export default Nav;