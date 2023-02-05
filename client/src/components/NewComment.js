// Component for the form that allows users to write comments under posts

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../stylesheets/NewComment.css';

const NewComment = ({ postID, userID }) => {
  const [error, setError] = useState('');
  const [content, setContent] = useState('');

  const navigate = useNavigate();

  const handleInput = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let body = { content: content, userID: userID };
    if (userID === 'guestuser123') {
      body = { content: content, byGuest: true };
    };
    axios.post(`${process.env.REACT_APP_SERVER_URL}/posts/${postID}/comments`, body)
      .then((response) => {
        if (response.data.errors) {
          setError(response.data.errors[0]);
        } else {
          navigate(0);
        };
      }
    );
  };

  return (
    <div className='comment-form'>
      <form action="">
        <textarea name="new-comment" id="new-comment" className='new-comment'
          placeholder="Respond to post..." onChange={(e) => handleInput(e)}
          maxLength={500}>
        </textarea>
        <p className='remaining'>{500 - content.length} chars remaining</p>
        <button className='user-post-btn' onClick={(e) => handleSubmit(e)}>Submit Comment</button>
        { error ?
          <p className='error-msg'>{error}</p>
          : null
        }
      </form>
    </div>
  );
};

export default NewComment;