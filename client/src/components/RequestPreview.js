// Component for displaying profile previews for FriendRequests.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import DefaultAvatar from '../images/default-avatar.svg';
import '../stylesheets/RequestPreview.css';

const RequestPreview = ({ req, outgoing, incoming }) => {
  const [profile, setProfile] = useState({});
  const [canceled, setCanceled] = useState(false);

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
    // WILL NEED TO DELETE THE FRIEND REQUEST OBJECT IN DB UPON ACCEPTANCE
    const body = { friend: req.to };
    axios.put(`${process.env.REACT_APP_SERVER_URL}/users/${req.from}/friends`, body)
      .then((response) => {
        console.log(response);
      });

    const body2 = { friend: req.from };
    axios.put(`${process.env.REACT_APP_SERVER_URL}/users/${req.to}/friends`, body2)
      .then((response) => {
        console.log(response);
      });
  }

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
        <button className='response-btn cancel-btn' 
          onClick={ !canceled ? (e) => handleCancel(e) : null }>
          { !canceled ? 'Cancel Request' : 'Canceled' }
        </button>
        : 
        <div className='response'>
          { !canceled ?
            // MAKE THIS BUTTON DISAPPEAR/CHANGE UPON ACCEPTANCE
            <button className='response-btn'
              onClick={(e) => handleAccept(e)}>
              Accept
            </button>
            : null
          }
          <button className='response-btn'
            onClick={(e) => handleCancel(e)}>
            { !canceled ? 'Reject' : 'Rejected!' }
          </button>
        </div>
      }
    </div>
  );
};

export default RequestPreview;