import React from 'react';

import Nav from './Nav';
import Footer from './Footer';
import '../stylesheets/FriendRequests.css';

const FriendRequests = () => {
  return (
    <div>
      <Nav />
      <div className='fr-container'>
        Friend request stuff goes here
      </div>
      <Footer />
    </div>
  );
};

export default FriendRequests;