import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../stylesheets/Post.css';

const Post = ({ content, author }) => {
  const [postAuthor, setPostAuthor] = useState({});

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/users/id/${author}`)
      .then((response) => {
        setPostAuthor(response.data.user);
      })
  }, [author]);

  return (
    <div className='post-container'>{content}</div>
  );
};

export default Post;