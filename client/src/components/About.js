import React, { useState } from 'react';

import Edit from '../images/edit.svg';
import '../stylesheets/About.css';

const About = ({ user, page }) => {
  const [edit, setEdit] = useState(false);
  const [about, setAbout] = useState('');

  const handleAbout = (e) => {
    setAbout(e.target.value);
  };

  const handleEdit = () => {
    edit ? setEdit(false) : setEdit(true);
  };

  return (
    <div className='user-intro'>
      { user.id === page._id ?
        <i>
          <img src={Edit} alt='Edit about section' className='edit-about' 
            onClick={() => handleEdit()}
          />
        </i>
        : null
      }
      {
        edit ?
        <form action="">
          <textarea name="user-about" id="user-about" className='user-about-text'
            placeholder='Write something about yourself...' maxLength={250}
            onChange={(e) => handleAbout(e)}>
            { user.about ? user.about : '' }
          </textarea>
          <i>{250 - about.length} chars remaining</i>
          <button>Submit Changes</button>
        </form>
        :
        <p className='about-text'>
          {
            user.about ?
            user.about 
            : "This user hasn't written their about section yet."
          }
        </p>
      }
    </div>
  );
};

export default About;