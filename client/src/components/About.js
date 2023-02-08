import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Edit from '../images/edit.svg';
import '../stylesheets/About.css';

const About = ({ user, page }) => {
  const [edit, setEdit] = useState(false);
  const [about, setAbout] = useState('');

  const navigate = useNavigate();

  const handleAbout = (e) => {
    setAbout(e.target.value);
  };

  const handleEdit = () => {
    edit ? setEdit(false) : setEdit(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = { about: about };
    axios.put(`${process.env.REACT_APP_SERVER_URL}/users/${user.id}/about`, body)
      .then((response) => {
        if (response.data.message === 'Success') {
          navigate(0);
        };
      })
      .catch((err) => {
        throw new Error(err);
      });
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
        <form action="" onSubmit={(e) => handleSubmit(e)}>
          <textarea name="user-about" id="user-about" className='user-about-text'
            placeholder='Write something about yourself...' maxLength={250}
            onChange={(e) => handleAbout(e)} defaultValue={ user.about ? user.about : '' }>
          </textarea>
          <i>{250 - about.length} chars remaining</i>
          <button>Submit Changes</button>
        </form>
        :
        <p className='about-text'>
          {
            page.about ?
            page.about 
            : "This user hasn't written their about section yet."
          }
        </p>
      }
    </div>
  );
};

export default About;