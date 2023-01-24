// Log-In Component

import React, { useState } from 'react';
import axios from 'axios';

import Nav from './Nav';
import Footer from './Footer';
import '../stylesheets/LogIn.css';

const LogIn = () => {


  return (
    <div>
      <Nav />
      <div className="login-container">
        <form action="" method="POST">
          <div className="form-group">
            <label htmlFor="username">Username: </label>
            <input type="text" name="username" id="username" placeholder="Username" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password: </label>
            <input type="password" name="password" id="password" placeholder="Password" />
          </div>
          <button>Log In</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default LogIn;