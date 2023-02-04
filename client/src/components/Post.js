// Component for displaying posts in news feed/profile pages

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DateTime } from 'luxon';

import NewComment from './NewComment';
import Comment from './Comment';
import Like from '../images/like.svg';
import CommentIcon from '../images/comment.svg';
import DefaultAvatar from '../images/default-avatar.svg';
import Delete from '../images/delete.svg';
import '../stylesheets/Post.css';

const Post = ({ post, author }) => {
  const [postAuthor, setPostAuthor] = useState({});
  const [user, setUser] = useState({});
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [displayComments, setDisplayComments] = useState(false);
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  // Sets the amount of likes and pulls comments on a post
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/posts/${post._id}`)
      .then((response) => {
        setLikes(response.data.post[0].likes);
        setComments(response.data.post[0].comments);
      });
  }, [post._id]);

  // Pulls active user info
  useEffect(() => {
    const body = { token: localStorage.getItem('token') }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/`, body)
      .then((response) => {
        setUser(response.data);
      });
  }, [token])

  // Pulls post author info
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/users/id/${author}`)
      .then((response) => {
        setPostAuthor(response.data);
      })
  }, [author]);

  // Handles displaying the new comment form and comments on click
  const handleDisplay = () => {
    displayComments ? setDisplayComments(false) : setDisplayComments(true);
  };

  // Handles adding/removing likes from posts
  const handleLike = () => {
    const body = { userID: user.id, postID: post._id };
    axios.post(`${process.env.REACT_APP_SERVER_URL}/posts/${post._id}`, body)
      .then((response) => {
        if (response.data.message === 'Successful') {
          setLikes(likes + 1);
        } else {
          setLikes(likes - 1);
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  // Handles deleting a post
  const handleDelete = () => {
    axios.delete(`${process.env.REACT_APP_SERVER_URL}/posts/${post._id}`)
      .then((response) => {
        if (response.data.message === 'Deleted') {
          navigate(0);
        };
      });
  };

  return (
    <div className='post-container'>
      {/* WILL PROBABLY NEED TO UPDATE IMAGE PULLING TO SUCCESSFULLY
        DISPLAY USER PROFILE PICS; WILL LIKELY NEED TO INSTALL A DEPENDENCY
        OR SOMETHING LIKE THAT TO HANDLE IMAGE HOSTING? */}
      <div className="post-header">
        <div>
          <img src={
            postAuthor.pfp ? postAuthor.pfp : DefaultAvatar
          } alt="User avatar" className='mini-avatar' />
          <Link to={`/user/${postAuthor.username}`} className='post-link'>
            <div className="post-info">
              <p className='post-author'>{postAuthor.first_name} {postAuthor.family_name}</p>
              <p className='post-date'>{DateTime.fromISO(post.date).toLocaleString(DateTime.DATE_MED)}</p>
            </div>
          </Link>
        </div>
        {
          user.id === post.author ?
          <i>
            <img src={Delete} alt='Delete post' className='post-action delete-post' 
              onClick={() => handleDelete()}
            />
          </i>
          : null
        }
      </div>
      <p className="post-body">{post.content}</p>
      <div className='post-actions'>
        <i onClick={() => handleDisplay()} className='comment-group'>
          { comments.length > 0 ? comments.length : null }
          <img src={CommentIcon} alt="Comment" className='post-action' />
        </i>
        {/* MAKE SO ICON HIGHLIGHTS BLUE WHEN LIKED BY USER? */}
        <i className='likes-container'>
          { likes ? likes : null }
          <img src={Like} alt="Like" className='post-action' onClick={() => handleLike()}/>
        </i>
      </div>
      {
        displayComments ? 
        <div className="comment-container">
          <NewComment postID={post._id} userID={user.id} />
          { comments.map((comment) => 
              <Comment key={comment} post={post} commentID={comment} userID={user.id} />
            )
          }
        </div>
        : null
      }
    </div>
  );
};

export default Post;