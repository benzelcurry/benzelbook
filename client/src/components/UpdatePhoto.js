import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Nav from './Nav';
import Footer from './Footer';
import DefaultAvatar from '../images/default-avatar.svg';
import '../stylesheets/UpdatePhoto.css';

const UpdatePhoto = () => {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState();
  const token = localStorage.getItem('token');

  // Pulls active user on client end
  useEffect(() => {
    const body = { token: localStorage.getItem('token') }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/`, body)
      .then((response) => {
        setUser(response.data);
      })
  }, [token])

  const handlePhoto = (e) => {
    
  }

  return (
    <div>
      <Nav />
      <div className='update-container'>
        {
          user.username === username ?
          <div>
            <p className="current-photo-caption">Current Avatar:</p>
            <img src={ avatar ? avatar : DefaultAvatar } alt='Current avatar' 
              className='current-avatar'
            />
            <form action="" encType='multipart/form-data' className='update-photo-form'>
              <div className="form-group">
                <label htmlFor="photo">New Avatar: </label>
                <input type="file" accept='.png, .jpg, .jpeg' name='photo' id='photo'
                  onChange={(e) => handlePhoto(e)} className='pfp-update' />
              </div>
              <button className='update-avatar-btn'>Update Photo</button>
            </form>
          </div>
          :
          <div className="wrong-user">403 Forbidden: Access Denied</div>
        }
      </div>
      <Footer />
    </div>
  );
};

export default UpdatePhoto;