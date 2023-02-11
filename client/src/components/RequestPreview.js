// Component for displaying profile previews for FriendRequests.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import DefaultAvatar from '../images/default-avatar.svg';
import '../stylesheets/RequestPreview.css';

const RequestPreview = ({ req, outgoing, incoming }) => {
  const [profile, setProfile] = useState({});
  const [canceled, setCanceled] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [avatar, setAvatar] = useState();

  // Pulls profile info to display on request preview
  useEffect(() => {
    outgoing ?
      (axios.get(`${process.env.REACT_APP_SERVER_URL}/users/id/${req.to}`)
        .then((response) => {
          setProfile(response.data);
        }))
    : 
      (axios.get(`${process.env.REACT_APP_SERVER_URL}/users/id/${req.from}`)
      .then((response) => {
        setProfile(response.data);
      }));
  }, [outgoing, req.from, req.to])

  // Gets user's profile picture
  useEffect(() => {
    if (profile.pfp) {
      setAvatar(`${process.env.REACT_APP_IMAGES}/${profile.pfp}`)
    }
  }, [profile])

  // Handles canceling outgoing requests
  const handleCancel = (e) => {
    e.preventDefault();
    axios.delete(`${process.env.REACT_APP_SERVER_URL}/requests/${req.id}`)
      .then((response) => {
        if (response.data.message === 'Success') {
          setCanceled(true);
        };
      });
  };

  // Handles accepting friend requests
  const handleAccept = (e) => {
    e.preventDefault();
    const body = { friend: req.to };
    axios.put(`${process.env.REACT_APP_SERVER_URL}/users/${req.from}/friends`, body)
    const body2 = { friend: req.from };
    axios.put(`${process.env.REACT_APP_SERVER_URL}/users/${req.to}/friends`, body2);
    axios.delete(`${process.env.REACT_APP_SERVER_URL}/requests/${req.id}`)
      .then((response) => {
        if (response.data.message === 'Success') {
          setAccepted(true);
        };
      });
  };

  return (
    <div className="request-preview">
      <Link to={`/user/${profile.username}`}
      className='request-link'>
        <div>
          <img src={
            avatar ? avatar : DefaultAvatar
          } alt="User avatar" className='preview-pic' />
          <h6 className="preview-name">
            {profile.first_name} {profile.family_name}
          </h6>
        </div>
      </Link>
      {
        outgoing ?
        <button className='response-btn cancel-btn' 
          onClick={ !canceled ? (e) => handleCancel(e) : null }>
          { !canceled ? 'Cancel Request' : 'Canceled' }
        </button>
        : 
        <div className='response'>
          { !canceled ?
            <button className='response-btn'
              onClick={ !accepted ? (e) => handleAccept(e) : null }>
              { !accepted ? 'Accept' : 'Accepted!' }
            </button>
            : null
          }
          { !accepted ?
            <button className='response-btn'
              onClick={ !canceled ? (e) => handleCancel(e) : null }>
              { !canceled ? 'Reject' : 'Rejected!' }
            </button>
            : null
          }
        </div>
      }
    </div>
  );
};

export default RequestPreview;