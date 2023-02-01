// Component for profile previews that are displayed in search results

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DateTime } from 'luxon';

import DefaultAvatar from '../images/default-avatar.svg';
import '../stylesheets/ProfilePreview.css';

const ProfilePreview = ({ user, friend }) => {
  const [account, setAccount] = useState({});

  useEffect(() => {
    if (friend) {
      axios.get(`${process.env.REACT_APP_SERVER_URL}/users/id/${friend}`)
        .then((response) => {
          setAccount(response.data);
        })
    }
  }, [friend])

  return (
    <div className="preview-container">
      { user ? 
        <div>
          <img src={ user.picture ? user.picture : DefaultAvatar }
          alt="User avatar" className='preview-pic' />
          <div className="preview-info">
            <h6 className="preview-name">{user.first_name} {user.family_name}</h6>
            <h6 className="preview-act-created">
              Account created: {DateTime.fromISO(user.account_created).toLocaleString(DateTime.DATE_MED)}
            </h6>
          </div>
        </div>
        :
        <div>
          <img src={ account.picture ? account.picture : DefaultAvatar }
          alt="User avatar" className='preview-pic' />
          <div className="preview-info">
          <h6 className="preview-name">{account.first_name} {account.family_name}</h6>
          <h6 className="preview-act-created">
            Account created: {DateTime.fromISO(account.account_created).toLocaleString(DateTime.DATE_MED)}
          </h6>
        </div>
      </div>
      }

    </div>
  );
};

export default ProfilePreview;