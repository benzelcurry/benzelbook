// Component for displaying posts in news feed/profile pages

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DateTime } from 'luxon';

import Like from '../images/like.svg';
import Comment from '../images/comment.svg';
import DefaultAvatar from '../images/default-avatar.svg';
import '../stylesheets/Post.css';

const Post = ({ post, author }) => {
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
      <div className="post-header">
        <img src={
          postAuthor.pfp ? postAuthor.pfp : DefaultAvatar
        } alt="User avatar" className='mini-avatar' />
        <div className="post-info">
          <p className='post-author'>{postAuthor.first_name} {postAuthor.family_name}</p>
          <p className='post-date'>{DateTime.fromISO(post.date).toLocaleString(DateTime.DATE_MED)}</p>
        </div>
      </div>
      <p className="post-body">{post.content}</p>
      <div className='post-actions'>
        <i><img src={Comment} alt="Comment" className='post-action' /></i>
        {/* ADD ABILITY TO LIKE COMMENTS BY CLICKING ICON; WILL 
          NEED TO CREATE A FUNCTION FOR HANDLING THIS */}
        <i><img src={Like} alt="Like" className='post-action' /></i>
      </div>
    </div>
  );
};

export default Post;