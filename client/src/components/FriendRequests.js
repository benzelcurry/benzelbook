import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Nav from './Nav';
import Footer from './Footer';
import '../stylesheets/FriendRequests.css';

const FriendRequests = () => {
  const [user, setUser] = useState({});
  const [requests, setRequests] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const body = { token: localStorage.getItem('token') }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/`, body)
      .then((response) => {
        setUser(response.data);
      })
  }, [token])

  // Pulls list of friend requests
  useEffect(() => {
    if (user.id) {
      axios.get(`${process.env.REACT_APP_SERVER_URL}/requests`)
        .then((response) => {
          // for (const request of response.data.request_list) {
          //   if (request.from === user.id) {
          //     setOutgoing(current => [...current, request]);
          //   } else if (request.to === user.id) {
          //     setIncoming(current => [...current, request]);
          //   }
          // }
          setRequests(response.data.request_list);
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  }, [user.id]);

  // Assigns friend requests as either incoming or outgoing
  useEffect(() => {
    for (const request of requests) {
      if (request.from === user.id) {
        if (!outgoing.some(obj => obj._id === request._id)) {
          setOutgoing(current => [...current, request]);
        }
      } else if (request.to === user.id) {
        if (!incoming.some(obj => obj._id === request._id)) {
          setIncoming(current => [...current, request]);
        };
      };
    }
  }, [user.id, requests])

  return (
    <div>
      <Nav />
      <div className='fr-container'>
        <div className="incoming-requests">
          <h2>Incoming Requests</h2>
          {
            incoming.length > 0 ? 
            <div>Will map incoming requests here</div>
            : <p>You currently have no incoming friend requests.</p>
          }
        </div>
        <div className="outgoing-requests">
          <h2>Outgoing Requests</h2>
          {
            outgoing.length > 0 ?
            outgoing.map((req) => 
              <p key={req._id}>{req.to}</p>
            )
            : <p>You currently have no outgoing friend requests.</p>
          }
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FriendRequests;