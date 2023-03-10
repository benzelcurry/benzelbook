// Component for displaying posts in news feed/profile pages

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [avatar, setAvatar] = useState();
  const [certainty, setCertainty] = useState(false);
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
    if (post.by_guest === true) {
      setPostAuthor({
        first_name: 'Guest',
        family_name: 'User',
        username: 'guestuser'
      });
    } else {
      axios.get(`${process.env.REACT_APP_SERVER_URL}/users/id/${author}`)
      .then((response) => {
        setPostAuthor(response.data);
      });
    };
  }, [post, author]);

  // Gets user's profile picture
  useEffect(() => {
    if (postAuthor.pfp) {
      setAvatar(`${process.env.REACT_APP_IMAGES}/${postAuthor.pfp}`)
    }
  }, [postAuthor])

  // Handles displaying the new comment form and comments on click
  const handleDisplay = () => {
    displayComments ? setDisplayComments(false) : setDisplayComments(true);
  };

  // Handles adding/removing likes from posts
  const handleLike = () => {
    if (user.id !== 'guestuser123') {
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
    }
  };

  // Asks user if they're sure before deleting a post
  const promptUser = () => {
    certainty ? setCertainty(false) : setCertainty(true);
  }

  // Handles deleting a post
  const handleDelete = () => {
    axios.delete(`${process.env.REACT_APP_SERVER_URL}/posts/${post._id}`)
      .then((response) => {
        if (response.data.message === 'Deleted') {
          navigate(0);
        };
      });
  };

  // Links to user's profile upon click
  const handleLink = () => {
    navigate(`/user/${postAuthor.username}`)
  }

  return (
    <div className='post-container'>
      <div className="post-header">
        <div onClick={() => handleLink()}>
          <img src={avatar ? avatar : DefaultAvatar} 
            alt="User avatar" className='mini-avatar' />
          <div className="post-info">
            <p className='post-author'>{postAuthor.first_name} {postAuthor.family_name}</p>
            <p className='post-date'>{DateTime.fromISO(post.date).toLocaleString(DateTime.DATE_MED)}</p>
          </div>
        </div>
        {
          user.id === post.author ?
          <i>
            <img src={Delete} alt='Delete post' className='post-action delete-post' 
              onClick={() => promptUser()}
            />
          </i>
          : null
        }
        {
          certainty ?
          <div className='delete-prompt'>
            <p>Are you sure you want to delete this post?</p>
            <div className="prompt-buttons">
              <button onClick={() => handleDelete()}>Yes</button>
              <button onClick={() => promptUser()}>No</button>
            </div>
          </div>
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