// Homepage component

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Nav from './Nav';
import Footer from './Footer';
import Post from './Post';
import DefaultAvatar from '../images/default-avatar.svg';
import '../stylesheets/App.css';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [page, setPage] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  // Pulls active user on client end
  useEffect(() => {
    const body = { token: localStorage.getItem('token') }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/`, body)
      .then((response) => {
        setUser(response.data);
      })
  }, [token])

  // PREVENTS FROM RE-RENDERING IN DEVELOPMENT MODE;
  // REMOVE WHEN PUSHING TO PRODUCTION; SERVES NO POINT WHEN
  // REACT NOT IN STRICT MODE. REMOVE FROM BELOW HOOK AS WELL.
  useEffect(() => {
    setPage('index');
  }, [])

  // Pulls list of posts and displays relevant ones on user's page
  useEffect(() => {
    if (page) {
      axios.get(`${process.env.REACT_APP_SERVER_URL}/posts`)
        .then((results) => {
          const postList = results.data.post_list;
          for (const post of postList) {
            if (post.target === post.author || !post.target) {
              if (!posts.some(obj => obj._id === post._id)) {
                setPosts(current => [...current, post]);
              };
            }
          };
        });
    }
  }, [page, posts]);

  // Handles new post content as user types
  const handleInput = (e) => {
    setContent(e.target.value);
  };

  // Sends post info to server
  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.length === 0) {
      return setError('Please enter a post before hitting submit.');
    };
    const body = { content: content, userID: user.id, targetID: page._id };
    axios.post(`${process.env.REACT_APP_SERVER_URL}/posts`, body)
      .then((response) => {
        if (response.data.message === 'Successful') {
          navigate(0);
        } else {
          setError(response.data.errors[0].msg);
        }
      })
      .catch((err) => {
        throw new Error(err);
      })
  };

  return (
    <div>
      <Nav />
      <div className="app">
          <div className="user-new-post">
            <img src={DefaultAvatar} alt="User avatar" className='mini-avatar' />
            <form action="">
              <textarea name="new-status" id="new-status" className='user-new-status'
                placeholder="What's on your mind?" onChange={(e) => handleInput(e)}
                maxLength={1000}>
              </textarea>
              <p className='remaining'>{1000 - content.length} chars remaining</p>
              <button className='user-post-btn' onClick={(e) => handleSubmit(e)}>Submit Post</button>
              { error ?
                <p className='error-msg'>{error}</p>
                : null
              }
            </form>
          </div>
        <div className="feed-posts">
          {posts.map((post) =>
            <Post key={post._id} post={post} author={post.author} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;