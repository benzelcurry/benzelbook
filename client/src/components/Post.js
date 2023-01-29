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
  const [user, setUser] = useState({});
  const [likes, setLikes] = useState(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/posts/${post._id}/likes`)
      .then((response) => {
        setLikes(response.data.total_likes);
      });
  }, [post._id]);

  useEffect(() => {
    const body = { token: localStorage.getItem('token') }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/`, body)
      .then((response) => {
        setUser(response.data);
      });
  }, [token])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/users/id/${author}`)
      .then((response) => {
        setPostAuthor(response.data.user);
      })
  }, [author]);

  const handleLike = () => {
    const body = { userID: user.id, postID: post._id };
    axios.post(`${process.env.REACT_APP_SERVER_URL}/posts/likes`, body)
      .then((response) => {
        if (response.data.message === 'Successful') {
          setLikes(likes + 1);
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

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
        <i className='likes-container'>
          { likes ? likes : null }
          <img src={Like} alt="Like" className='post-action' onClick={() => handleLike()}/>
        </i>
      </div>
    </div>
  );
};

export default Post;