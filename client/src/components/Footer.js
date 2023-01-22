// Footer component

import React from 'react';

import Github from '../images/github.svg';
import '../stylesheets/Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      Copyright © 
      <a href="https://github.com/benzelcurry" className='personal-link' target='_blank' rel='noreferrer noopener'>
      <i><img src={Github} alt="GitHub" className='github' /></i>
      benzelcurry</a> 
      2023
    </div>
  );
};

export default Footer;