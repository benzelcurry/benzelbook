import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Nav from './Nav';
import Footer from './Footer';
import '../stylesheets/FriendList.css';

const FriendList = () => {
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
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
    if (user.id) {
      axios.get(`${process.env.REACT_APP_SERVER_URL}/users/id/${user.id}`)
        .then((response) => {
          console.log(response.data.friends);
        })
    }
  }, [user.id]);

  return (
    <div>
      <Nav />
      <div className="fl-container">
        Friend list stuff will go here.
      </div>
      <Footer />
    </div>
  );
};

export default FriendList;