// Component for displaying profile previews for FriendRequests.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import DefaultAvatar from '../images/default-avatar.svg';
import '../stylesheets/RequestPreview.css';

const RequestPreview = ({ req, outgoing }) => {
  const [profile, setProfile] = useState({});
  const [canceled, setCanceled] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/users/id/${req.to}`)
      .then((response) => {
        setProfile(response.data);
      });
  }, [req.to])

  const handleCancel = (e) => {
    e.preventDefault();
    axios.delete(`${process.env.REACT_APP_SERVER_URL}/requests/${req.id}`)
      .then((response) => {
        if (response.data.message === 'Success') {
          setCanceled(true);
        };
      });
  };

  return (
    <div className="request-preview">
      <Link to={`/user/${profile.username}`}
      className='request-link'>
        <div>
          <img src={
            profile.picture ? profile.picture : DefaultAvatar
          } alt="User avatar" className='preview-pic' />
          <h6 className="preview-name">
            {profile.first_name} {profile.family_name}
          </h6>
        </div>
      </Link>
      {
        outgoing ?
        <button className='response-btn' 
          onClick={ !canceled ? (e) => handleCancel(e) : null }>
          { !canceled ? 'Cancel Request' : 'Canceled' }
        </button>
        : 
        <div className='response'>
          <button className='response-btn'>Accept</button>
          <button className='response-btn'>Reject</button>
        </div>
      }
    </div>
  );
};

export default RequestPreview;