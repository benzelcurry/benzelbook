import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Nav from './Nav';
import Footer from './Footer';
import DefaultAvatar from '../images/default-avatar.svg';
import '../stylesheets/UpdatePhoto.css';

const UpdatePhoto = () => {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState();
  const [photo, setPhoto] = useState();
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  // Pulls active user on client end
  useEffect(() => {
    const body = { token: localStorage.getItem('token') }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/`, body)
      .then((response) => {
        setUser(response.data);
      })
  }, [token])

  // GET user avatar
  useEffect(() => {
    if (user.id) {
      axios.get(`${process.env.REACT_APP_SERVER_URL}/images/${user.pfp}`, {responseType: 'blob'} )
        .then((response) => {
          setAvatar(URL.createObjectURL(response.data));
        })
    }
  }, [user])

  // Sets the target photo that user is trying to update
  const handlePhoto = (e) => {
    setPhoto(e.target.files[0]);
  }

  // Handles submitting and updating the user's new profile picture
  const handleSubmit = (e) => {
    e.preventDefault();
    const body = new FormData();
    body.append('pfp', photo);
    axios.put(`${process.env.REACT_APP_SERVER_URL}/users/${user.id}/avatar`, body)
      .then((response) => {
        if (response.data.errors) {
          if (typeof(response.data.errors[0]) === 'object') {
            return setError(response.data.errors[0].msg);
          } else {
            return setError(response.data.errors[0]);
          }
        } else if (response.data.message === 'Success') {
          navigate(0);
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

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
            <form action="" encType='multipart/form-data' className='update-photo-form'
              onSubmit={(e) => handleSubmit(e)}>
              <div className="form-group">
                <label htmlFor="photo">New Avatar: </label>
                <input type="file" accept='.png, .jpg, .jpeg' name='photo' id='photo'
                  onChange={(e) => handlePhoto(e)} className='pfp-update' />
              </div>
              <button className='update-avatar-btn'>Update Photo</button>
            </form>
            <p className='error-msg'>{ error ? error : null }</p>
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