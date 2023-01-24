// Nav/Header component

import React from 'react';
import { Link } from 'react-router-dom';

import '../stylesheets/Nav.css';

const Nav = () => {
  return (
    <div className='header'>
      <Link to={'/'} className='nav-link'>
        <button className='site-title'>Benzelbook</button>
      </Link>
      { /* MAKE LOGIN BUTTON CONDITIONALLY DISPLAY ONLY IF USER
        IS LOGGED OUT */ }
      <Link to={'/login'} className='nav-link'>
        <button className='login-btn nav-btn'>Log In</button>
      </Link>
    </div>
  );
};

export default Nav;