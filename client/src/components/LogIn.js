import React from 'react';

import Nav from './Nav';
import Footer from './Footer';
import '../stylesheets/LogIn.css';

const LogIn = () => {
  return (
    <div>
      <Nav />
      <div className="login-container">
        Log In stuff will go here!
      </div>
      <Footer />
    </div>
  );
};

export default LogIn;