import React from 'react';
import { DateTime } from 'luxon';

import DefaultAvatar from '../images/default-avatar.svg';
import '../stylesheets/ProfilePreview.css';

const ProfilePreview = ({ user }) => {
  return (
    <div className="preview-container">
      <img src={ user.picture ? user.picture : DefaultAvatar } 
      alt="User avatar" className='preview-pic' />
      <div className="preview-info">
        <div className="preview-name">{user.first_name} {user.family_name}</div>
        <div className="preview-act-created">
          {DateTime.fromISO(user.account_created).toLocaleString(DateTime.DATE_MED)}
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;