import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Nav from './Nav';
import Footer from './Footer';
import DefaultAvatar from '../images/default-avatar.svg';
import '../stylesheets/User.css';

const User = () => {
  const [user, setUser] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    const body = { token: localStorage.getItem('token') }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/`, body)
      .then((response) => {
        console.log(response.data);
        setUser(response.data);
      })
  }, [token])

  return (
    <div>
      <Nav />
      <div className="user-container">
        <div className="cover-photo"></div>
        <div className="user-header">
          <img src={DefaultAvatar} alt="User avatar" className='profile-pic' />
          <div className="user-basics">
            <div className="user-fullname">{user.name}</div>
          </div>
        </div>
        <div className="user-contents">
          <div className="user-intro">
            User intro content will go in here.
          </div>
          <div className="user-posts">
            <div className="user-new-post">
              <img src={DefaultAvatar} alt="User avatar" className='mini-avatar' />
              <form action="" method="POST">
                <textarea name="new-status" id="new-status" className='user-new-status'
                  placeholder="What's on your mind?">
                </textarea>
                <button className='user-post-btn'>Submit Post</button>
              </form>
            </div>
            <div className="user-wall">
              Posts on user's wall will go in here.
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default User;