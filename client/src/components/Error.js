import React from 'react';

import Nav from './Nav';
import Footer from './Footer';
import '../stylesheets/NoUser.css';

const NoUser = () => {
  return (
    <div>
      <Nav />
      <div>404</div>
      <Footer />
    </div>
  );
};

export default NoUser;