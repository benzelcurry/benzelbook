import React, { useState, useEffect } from 'react';
import axios from 'axios';

import DefaultAvatar from '../images/default-avatar.svg';
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
    <div className='post-container'>
      {/* WILL PROBABLY NEED TO UPDATE IMAGE PULLING TO SUCCESSFULLY
        DISPLAY USER PROFILE PICS; WILL LIKELY NEED TO INSTALL A DEPENDENCY
        OR SOMETHING LIKE THAT TO HANDLE IMAGE HOSTING? */}
      <img src={
        postAuthor.pfp ? postAuthor.pfp : DefaultAvatar
      } alt="User avatar" className='mini-avatar' />
      <p className='post-author'>{postAuthor.first_name} {postAuthor.family_name}</p>
      <p className="post-body">{content}</p>
    </div>
  );
};

export default Post;