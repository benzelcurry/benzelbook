// Component for displaying comments on posts

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../stylesheets/Comment.css';

const Comment = ({ postID, commentID }) => {
  const [comment, setComment] = useState({});

  // Pulls the comment details using ID
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/posts/${postID}/comments/${commentID}`)
      .then((response) => {
        setComment(response.data.comment);
      }
    )
  }, [postID, commentID])

  return (
    <div>
      {comment.content}
    </div>
  );
};

export default Comment;