// Component for displaying comments on posts

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../stylesheets/Comment.css';

const Comment = ({ postID, commentID }) => {
  const [comment, setComment] = useState({});
  const [author, setAuthor] = useState('');

  // Pulls the comment details using ID
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/posts/${postID}/comments/${commentID}`)
      .then((response) => {
        setComment(response.data.comment);
      }
    )
  }, [postID, commentID])

  // Pulls comment author name by using the provided ID
  useEffect(() => {
    if (comment.author) {
      axios.get(`${process.env.REACT_APP_SERVER_URL}/users/id/${comment.author}`)
        .then((response) => {
          setAuthor(response.data.username);
        }
      )
    }
  }, [comment.author])

  return (
    <div className='comment-container'>
      <div className="comment-author">{author}</div>
      <div className="comment-content">{comment.content}</div>
    </div>
  );
};

export default Comment;