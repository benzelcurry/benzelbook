// 404 component that displays when no matching URL is found

import React from 'react';

import Nav from './Nav';
import Footer from './Footer';
import '../stylesheets/Error.css';

const NoUser = () => {
  return (
    <div>
      <Nav />
      <div className='error-container'>
        <div className="error-code">Error: 404</div>
        <div className="error-msg">The page you're looking for doesn't exist.</div>
      </div>
      <Footer />
    </div>
  );
};

export default NoUser;