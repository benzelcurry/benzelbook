// Displays the friends list for any given User

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Nav from './Nav';
import Footer from './Footer';
import ProfilePreview from './ProfilePreview';
import '../stylesheets/FriendList.css';

const FriendList = () => {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [admin, setAdmin] = useState(false);
  const token = localStorage.getItem('token');

  // Pulls active user on client end
  useEffect(() => {
    const body = { token: localStorage.getItem('token') }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/`, body)
      .then((response) => {
        setUser(response.data);
      })
  }, [token])

  // Pulls list of active User's friends
  useEffect(() => {
    // if (user.id) {
    //   axios.get(`${process.env.REACT_APP_SERVER_URL}/users/id/${user.id}`)
    //     .then((response) => {
    //       setFriends(response.data.friends);
    //     })
    // }
    axios.get(`${process.env.REACT_APP_SERVER_URL}/users/${username}`)
      .then((response) => {
        setFriends(response.data.user.friends);
      })
  }, [username]);

  // Determines if user is viewing their own friends list, and
  // displays 'Delete' buttons if so
  useEffect(() => {
    if (user.username === username) {
      setAdmin(true);
    };
  }, [user.username, username])

  return (
    <div>
      <Nav />
      <div className="fl-container">
        {  
          friends.map((friend) => 
            <ProfilePreview key={friend} friend={friend} admin={admin} />
          )
        }
      </div>
      <Footer />
    </div>
  );
};

export default FriendList;