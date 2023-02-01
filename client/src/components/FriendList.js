import React from 'react';

import Nav from './Nav';
import Footer from './Footer';
import '../stylesheets/FriendList.css';

const FriendList = () => {
  return (
    <div>
      <Nav />
      <div className="fl-container">
        Friend list stuff will go here.
      </div>
      <Footer />
    </div>
  );
};

export default FriendList;