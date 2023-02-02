// Homepage component

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Nav from './Nav';
import Footer from './Footer';
import Post from './Post';
import NewPost from './NewPost';
import '../stylesheets/App.css';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [page, setPage] = useState('');
  const token = localStorage.getItem('token');

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

  return (
    <div>
      <Nav />
      <div className="app">
        <NewPost userID={user.id} />
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