import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Nav from './Nav';
import Footer from './Footer';
import '../stylesheets/UpdatePhoto.css';

const UpdatePhoto = () => {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const token = localStorage.getItem('token');

  // Pulls active user on client end
  useEffect(() => {
    const body = { token: localStorage.getItem('token') }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/`, body)
      .then((response) => {
        setUser(response.data);
      })
  }, [token])

  return (
    <div>
      <Nav />
      <div className='update-container'>
        {
          user.username === username ?
          <div>Update stuff will go here</div>
          :
          <div className="wrong-user">403 Forbidden: Access Denied</div>
        }
      </div>
      <Footer />
    </div>
  );
};

export default UpdatePhoto;