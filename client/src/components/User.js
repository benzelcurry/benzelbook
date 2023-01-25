import React from 'react';

import Nav from './Nav';
import Footer from './Footer';
import '../stylesheets/User.css';

const User = () => {
  return (
    <div>
      <Nav />
      <div className="user-container">
        User info will go here.
      </div>
      <Footer />
    </div>
  );
};

export default User;