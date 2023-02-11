import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import DefaultAvatar from '../images/default-avatar.svg';
import '../stylesheets/NewPost.css';

const NewPost = ({ userID, targetID }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState();

  const navigate = useNavigate();

  // Handles new post content as user types
  const handleInput = (e) => {
    setContent(e.target.value);
  };

  // Sends post info to server
  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.length === 0) {
      return setError('Please enter a post before hitting submit.');
    };
    const body = { content: content, userID, targetID };
    axios.post(`${process.env.REACT_APP_SERVER_URL}/posts`, body)
      .then((response) => {
        if (response.data.message === 'Successful') {
          navigate(0);
        } else {
          setError(response.data.errors[0].msg);
        }
      })
      .catch((err) => {
        throw new Error(err);
      })
  };

  // Gets user's data
  useEffect(() => {
    if (userID) {
      axios.get(`${process.env.REACT_APP_SERVER_URL}/users/id/${userID}`)
        .then((response) => {
          setUser(response.data);
        })
    }
  }, [userID])

  // Gets user's profile picture
  useEffect(() => {
    if (user.pfp) {
      setAvatar(`${process.env.REACT_APP_IMAGES}/${user.pfp}`)
    }
  }, [user])

  return (
    <div className="user-new-post">
      {
        avatar ?
        <img src={avatar} alt='User avatar' className='mini-avatar' />
        :
        <img src={DefaultAvatar} alt="User avatar" className='mini-avatar' />
      }
      <form action="">
        <textarea name="new-status" id="new-status" className='user-new-status'
          placeholder="What's on your mind?" onChange={(e) => handleInput(e)}
          maxLength={1000}>
        </textarea>
        <p className='remaining'>{1000 - content.length} chars remaining</p>
        <button className='user-post-btn' onClick={(e) => handleSubmit(e)}>Submit Post</button>
        { error ?
          <p className='error-msg'>{error}</p>
          : null
        }
      </form>
    </div>
  );
};

export default NewPost;