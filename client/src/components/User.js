// Component for user profile pages

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Nav from './Nav';
import Footer from './Footer';
import Post from './Post';
import DefaultAvatar from '../images/default-avatar.svg';
import '../stylesheets/User.css';

const User = () => {
  const { username } = useParams();
  const [current, setCurrent] = useState(username);
  const [user, setUser] = useState({});
  const [page, setPage] = useState({});
  const [posts, setPosts] = useState([]);
  const [pending, setPending] = useState(false);
  const [existing, setExisting] = useState();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Reloads page if URL parameters change
  useEffect(() => {
    if (current !== username) {
      setCurrent(username);
      window.location.reload();
    }
  }, [current, username])

  // Pulls active user on client end
  useEffect(() => {
    const body = { token: localStorage.getItem('token') }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/`, body)
      .then((response) => {
        setUser(response.data);
      })
  }, [token])

  // Pulls account info from URL params to populate page
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/users/${username}`)
      .then((results) => {
        if (results.data.user) {
          setPage(results.data.user);
        } else {
          navigate('/404');
        };
      });
  }, [navigate, username]);

  // Pulls list of posts and displays relevant ones on user's page
  useEffect(() => {
    if (page._id) {
      axios.get(`${process.env.REACT_APP_SERVER_URL}/posts/`)
        .then((results) => {
          const postList = results.data.post_list;
          for (const post of postList) {
            if ((post.author === page._id && !post.target) || post.target === page._id) {
              if (!posts.some(obj => obj._id === post._id)) {
                setPosts(current => [...current, post]);
              };
            };
          };
        });
    } 
  }, [page._id, posts]);

  // Checks to see if there's a pending friend request
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/requests`)
      .then((response) => {
        const requests = response.data.request_list;
        const existingRequest = requests.find(req => (req.from === user.id) && req.to === page._id);
        if (existingRequest) {
          setPending(true);
          setExisting(existingRequest.id); 
        };
      })
  }, [page._id, user.id, pending]);

  // Updates message content in state upon change
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

  // Sends/cancels a friend request from active user to profile page's account
  const handleRequest = (e) => {
    e.preventDefault();
    if (!pending) {
      const body = { userID: user.id, pageID: page._id };
      axios.post(`${process.env.REACT_APP_SERVER_URL}/requests`, body)
        .then((response) => {
          if (response.data.message === 'Success') {
            return setPending(true);
          };
        })
        .catch((err) => {
          throw new Error(err);
        });
    } else {
      axios.delete(`${process.env.REACT_APP_SERVER_URL}/requests/${existing}`)
        .then((response) => {
          if (response.data.message === 'Success') {
            return setPending(false);
          };
        })
        .catch((err) => {
          throw new Error(err);
        });
    };
  };

  return (
    <div>
      <Nav />
      <div className="user-container">
        <div className="cover-photo"></div>
        <div className="user-header">
          <img src={DefaultAvatar} alt="User avatar" className='profile-pic' />
          <div className="user-basics">
            <h1 className="user-fullname">{page.first_name} {page.family_name}</h1>
            {
              // GET THIS TO HIDE IF USERS ARE ALREADY FRIENDS
              (user.id !== page._id) ?
              <button className='add-friend' onClick={(e) => handleRequest(e)}>
                { pending ? 'Cancel Request' : 'Add Friend' }
              </button>
              : null
            }
          </div>
        </div>
        <div className="user-contents">
          <div className="user-intro">
            User intro content will go in here.
          </div>
          <div className="user-posts">
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
            <div className="user-wall">
              {posts.map((post) =>
                <Post key={post._id} post={post} author={post.author} />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default User;