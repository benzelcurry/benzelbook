// Component for displaying profile previews for FriendRequests.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import DefaultAvatar from '../images/default-avatar.svg';
import '../stylesheets/RequestPreview.css';

const RequestPreview = ({ id }) => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/users/id/${id}`)
      .then((response) => {
        setProfile(response.data);
      });
  }, [id])

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
    </div>
  );
};

export default RequestPreview;