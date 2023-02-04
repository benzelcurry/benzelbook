// Component for displaying comments on posts

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DateTime } from 'luxon';

import DefaultAvatar from '../images/default-avatar.svg';
import Like from '../images/like.svg';
import Delete from '../images/delete.svg';
import '../stylesheets/Comment.css';

const Comment = ({ post, commentID, userID }) => {
  const [comment, setComment] = useState({});
  const [author, setAuthor] = useState('');
  const [likes, setLikes] = useState();

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
    }
  }, [comment.author])

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
        console.log(response);
      });
  };

  return (
    <div className='comment-cards'>
      <div>
        <div className="comment-user">
          <img src={ author.pfp ? author.pfp : DefaultAvatar }
            alt="User avatar" className='mini-avatar' />
          <div className="comment-info">
            <i className="comment-author">{author.username}</i>
            <p className='comment-date'>
              {DateTime.fromISO(comment.date).toLocaleString(DateTime.DATE_MED)}
            </p>
          </div>
        </div>
        {
          userID === author.id ?
          <i>
            <img src={Delete} alt="Delete comment icon" className='post-action' 
              onClick={(e) => handleDelete(e)}
            />
          </i>
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