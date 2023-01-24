// Nav/Header component

import React from 'react';
import { Link } from 'react-router-dom';

import '../stylesheets/Nav.css';

const Nav = () => {
  return (
    <div className='header'>
      <button className='site-title'>Benzelbook</button>
      { /* MAKE LOGIN BUTTON CONDITIONALLY DISPLAY ONLY IF USER
        IS LOGGED OUT */ }
      
        <button className='login-btn nav-btn'>Log In</button>
      
    </div>
  );
};

export default Nav;