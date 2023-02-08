import React, { useState } from 'react';

import Edit from '../images/edit.svg';
import '../stylesheets/About.css';

const About = ({ user, page }) => {
  return (
    <div className='user-intro'>
      { user.id === page._id ?
        <i><img src={Edit} alt='Edit about section' className='edit-about' /></i>
        : null
      }
    </div>
  );
};

export default About;