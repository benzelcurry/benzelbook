// Nav/Header component

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import FriendRequest from '../images/friend-request.svg';
import '../stylesheets/Nav.css';

const Nav = () => {
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  useEffect(() => {
    const body = { token: localStorage.getItem('token') }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/`, body)
      .then((response) => {
        setName(response.data.name);
        setUsername(response.data.username);
      })
  }, [token])

  const handleClick = (e) => {
    localStorage.clear();
    navigate(0);
  }

  return (
    <div className='header'>
      <div className="nav-left">
        <Link to={'/'} className='nav-link'>
          <button className='site-title'>Benzelbook</button>
        </Link>
        {/* MAKE THIS SEARCH FIELD FUNCTIONAL */}
        <form action="">
            <input type="text" placeholder='Search Benzelbook' className='nav-search' />
        </form>
      </div>
      <div className="nav-right">
        { name ?
          <div>
            <Link to={'/friend-requests'} className='nav-link'>
              <img src={FriendRequest} alt="Friend requests icon" className='fr-nav' />
            </Link>
            <Link to={`/user/${username}`} className='nav-link'>
              <button className='nav-btn'>{name}</button>
            </Link>
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