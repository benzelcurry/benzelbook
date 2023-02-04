// Component for the form that allows users to write comments under posts

import React, { useState } from 'react';
import axios from 'axios';

import '../stylesheets/NewComment.css';

const NewComment = () => {
  const [error, setError] = useState('');
  const [content, setContent] = useState('');

  const handleInput = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

  }

  return (
    <div>
      <form action="">
        <textarea name="new-status" id="new-status" className='user-new-status'
          placeholder="Respond to post..." onChange={(e) => handleInput(e)}
          maxLength={500}>
        </textarea>
        <p className='remaining'>{500 - content.length} chars remaining</p>
        <button className='user-post-btn' onClick={(e) => handleSubmit(e)}>Submit Post</button>
        { error ?
          <p className='error-msg'>{error}</p>
          : null
        }
      </form>
    </div>
  );
};

export default NewComment;