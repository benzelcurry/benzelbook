// Component for displaying comments on posts

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { DateTime } from 'luxon';

import DefaultAvatar from '../images/default-avatar.svg';
import Like from '../images/like.svg';
import Delete from '../images/delete.svg';
import '../stylesheets/Comment.css';

const Comment = ({ post, commentID, userID }) => {
  const [comment, setComment] = useState({});
  const [author, setAuthor] = useState({});
  const [avatar, setAvatar] = useState();
  const [likes, setLikes] = useState();
  const [certainty, setCertainty] = useState(false);

  const navigate = useNavigate();

  // Pulls the comment details using ID
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/posts/${post._id}/comments/${commentID}`)
      .then((response) => {
        setComment(response.data.comment);
        setLikes(response.data.comment.likes);
      }
    )
  }, [post._id, commentID])

  // Pulls comment author name by using the provided ID
  useEffect(() => {
    if (comment.author) {
      axios.get(`${process.env.REACT_APP_SERVER_URL}/users/id/${comment.author}`)
        .then((response) => {
          setAuthor(response.data);
        }
      )
    } else {
      setAuthor({
        username: 'guestuser',
        first_name: 'Guest',
        family_name: 'User',
        id: 'guestuser123',
      });
    };
  }, [comment.author])

  // Gets user's profile picture
  useEffect(() => {
    if (author.pfp) {
      axios.get(`${process.env.REACT_APP_SERVER_URL}/images/${author.pfp}`, {responseType: 'blob'} )
        .then((response) => {
          setAvatar(URL.createObjectURL(response.data));
        })
    }
  }, [author])

  // Handles liking/unliking a comment
  const handleLike = (e) => {
    e.preventDefault();
    const body = { userID: userID };
    axios.post(`${process.env.REACT_APP_SERVER_URL}/posts/${comment._id}`, body)
      .then((response) => {
        if (response.data.message === 'Successful') {
          setLikes(likes + 1);
        } else {
          setLikes(likes - 1);
        }
      })
      .catch((err) => {
        throw new Error(err);
      }
    )
  }

  // Handles deleting a comment
  const handleDelete = (e) => {
    e.preventDefault();
    axios.delete(`${process.env.REACT_APP_SERVER_URL}/posts/${post._id}/comments/${comment._id}`)
      .then((response) => {
        if (response.data.message === 'Deleted') {
          navigate(0);
        }
      });
  };

  // Asks user if they're sure before deleting a post
  const promptUser = () => {
    certainty ? setCertainty(false) : setCertainty(true);
  }

  return (
    <div className='comment-cards'>
      <div>
        <div className="comment-user">
          <img src={ avatar ? avatar : DefaultAvatar }
            alt="User avatar" className='mini-avatar' />
          <div className="comment-info">
            <Link to={'/user/author.username'} className='user-link'>
              <i className="comment-author">{author.first_name} {author.family_name}</i>
            </Link>
            <p className='comment-date'>
              {DateTime.fromISO(comment.date).toLocaleString(DateTime.DATE_MED)}
            </p>
          </div>
        </div>
        {
          userID === author.id ?
          <i>
            <img src={Delete} alt="Delete comment icon" className='post-action' 
              onClick={() => promptUser()}
            />
          </i>
          : null
        }
        {
          certainty ?
          <div className='delete-prompt'>
            <p>Are you sure you want to delete this comment?</p>
            <div className="prompt-buttons">
              <button onClick={(e) => handleDelete(e)}>Yes</button>
              <button onClick={() => promptUser()}>No</button>
            </div>
          </div>
          : null
        }
      </div>
      <p className="comment-content">{comment.content}</p>
      <i className='comment-action'>
        { likes ? likes : null }
        <img src={Like} alt="Like icon" className='post-action' 
          onClick={(e) => handleLike(e)}
        />
      </i>
    </div>
  );
};

export default Comment;