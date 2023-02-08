// Component for profile previews that are displayed in search results

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DateTime } from 'luxon';

import DefaultAvatar from '../images/default-avatar.svg';
import '../stylesheets/ProfilePreview.css';

const ProfilePreview = ({ user, friend, admin }) => {
  const [active, setActive] = useState({});
  const [account, setAccount] = useState({});
  const [friends, setFriends] = useState(true);
  const [avatar, setAvatar] = useState();
  const token = localStorage.getItem('token');

  // Pulls active user on client end
  useEffect(() => {
    const body = { token: localStorage.getItem('token') }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/`, body)
      .then((response) => {
        setActive(response.data);
      })
  }, [token]);

  // Sets account data using ID pulled from friends list
  useEffect(() => {
    if (friend) {
      axios.get(`${process.env.REACT_APP_SERVER_URL}/users/id/${friend}`)
        .then((response) => {
          setAccount(response.data);
        })
    }
  }, [friend]);

  // Gets user's profile picture
  useEffect(() => {
    if (account.pfp) {
      axios.get(`${process.env.REACT_APP_SERVER_URL}/images/${account.pfp}`, {responseType: 'blob'} )
        .then((response) => {
          setAvatar(URL.createObjectURL(response.data));
        })
    }
  }, [account])

  // Deletes a friend upon pressing 'Remove Friend' button
  const handleDelete = (e) => {
    e.preventDefault();
    const body = { friend: friend };
    axios.put(`${process.env.REACT_APP_SERVER_URL}/users/${active.id}/friends/delete`, body);
    const body2 = { friend: active.id };
    axios.put(`${process.env.REACT_APP_SERVER_URL}/users/${friend}/friends/delete`, body2);
    setFriends(false);
  };

  return (
    <div>
      { user ? 
        <div className="preview-container">
          <img src={ avatar ? avatar : DefaultAvatar }
          alt="User avatar" className='preview-pic' />
          <div className="preview-info">
            <h6 className="preview-name">{user.first_name} {user.family_name}</h6>
            <h6 className="preview-act-created">
              Account created: {DateTime.fromISO(user.account_created).toLocaleString(DateTime.DATE_MED)}
            </h6>
          </div>
        </div>
        :
        <div className='friends-preview'>
          <Link to={`/user/${account.username}`} className='friends-link'>
            <img src={ avatar ? avatar : DefaultAvatar }
            alt="User avatar" className='preview-pic' />
            <div className="preview-info">
              <h6 className="preview-name">{account.first_name} {account.family_name}</h6>
              <h6 className="preview-act-created">
                Account created: {DateTime.fromISO(account.account_created).toLocaleString(DateTime.DATE_MED)}
              </h6>
            </div>
          </Link>
            {
              admin ? 
              <button className='remove-friend' onClick={(e) => handleDelete(e)}>
                { friends ? 'Remove Friend' : 'Removed!' }
              </button>
              : null
            }
        </div>
      }
    </div>
  );
};

export default ProfilePreview;