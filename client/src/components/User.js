// Component for user profile pages

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Nav from './Nav';
import Footer from './Footer';
import Post from './Post';
import NewPost from './NewPost';
import About from './About';
import DefaultAvatar from '../images/default-avatar.svg';
import Camera from '../images/camera.svg';
import '../stylesheets/User.css';

const User = () => {
  const { username } = useParams();
  const [current, setCurrent] = useState(username);
  const [user, setUser] = useState({});
  const [page, setPage] = useState({});
  const [image, setImage] = useState();
  const [friends, setFriends] = useState(false);
  const [posts, setPosts] = useState([]);
  const [pending, setPending] = useState(false);
  const [incoming, setIncoming] = useState(false);
  const [existing, setExisting] = useState();
  const [accepted, setAccepted] = useState(false);
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
        const incomingRequest = requests.find(req => (req.to === user.id) && req.from === page._id);
        if (existingRequest) {
          setPending(true);
          setExisting(existingRequest.id); 
        };
        if (incomingRequest) {
          setIncoming(true);
          setExisting(incomingRequest.id);
        };
      })
  }, [page._id, user.id, pending, incoming]);

  // Checks to see if active user and page owner are friends
  useEffect(() => {
    if (user.id) {
      axios.get(`${process.env.REACT_APP_SERVER_URL}/users/id/${user.id}`)
        .then((response) => {
          const friends = response.data.friends;
          if (friends.includes(page._id)) {
            return setFriends(true);
          };
        });
    }
  }, [user.id, page._id]);

  // Gets page owner's profile picture
  useEffect(() => {
    if (page._id) {
      axios.get(`${process.env.REACT_APP_SERVER_URL}/images/${page.pfp}`, {responseType: 'blob'} )
        .then((response) => {
          setImage(URL.createObjectURL(response.data));
        })
    }
  }, [page])

  // Sends/cancels a friend request from active user to profile page's account
  // Also handles accepting/deleting incoming requests
  const handleRequest = (e) => {
    e.preventDefault();
    if (!pending && !incoming) {
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
    } else if (pending && !incoming) {
      axios.delete(`${process.env.REACT_APP_SERVER_URL}/requests/${existing}`)
        .then((response) => {
          if (response.data.message === 'Success') {
            return setPending(false);
          };
        })
        .catch((err) => {
          throw new Error(err);
        });
    } else if (incoming) {
      const body1 = { friend: user.id };
      axios.put(`${process.env.REACT_APP_SERVER_URL}/users/${page._id}/friends`, body1)
      const body2 = { friend: page._id };
      axios.put(`${process.env.REACT_APP_SERVER_URL}/users/${user.id}/friends`, body2);
      axios.delete(`${process.env.REACT_APP_SERVER_URL}/requests/${existing}`)
        .then((response) => {
          if (response.data.message === 'Success') {
            setAccepted(true);
          };
        });
    }
  };

  // Deletes a friend upon pressing 'Remove Friend' button
  const handleDelete = (e) => {
    e.preventDefault();
    const body = { friend: page._id };
    axios.put(`${process.env.REACT_APP_SERVER_URL}/users/${user.id}/friends/delete`, body);
    const body2 = { friend: user.id };
    axios.put(`${process.env.REACT_APP_SERVER_URL}/users/${page._id}/friends/delete`, body2);
    setFriends(false);
  };

  // Navigates user to avatar update page upon clicking button
  const handlePhoto = () => {
    navigate(`/user/${user.username}/update-photo`);
  }

  return (
    <div>
      <Nav />
      <div className="user-container">
        <div className="cover-photo"></div>
        <div className="user-header">
          <div className="user-photo">
            <img src={image ? image : DefaultAvatar} alt='User avatar' className='profile-pic' />
            {
              user.id === page._id ?
              <button className='update-photo-btn' onClick={() => handlePhoto()}>
                <i><img src={Camera} alt='Camera icon' className='camera-icon' /></i>
                Update Photo
              </button>
              : null
            }
          </div>
          <div className="user-basics">
            <h1 className="user-fullname">{page.first_name} {page.family_name}</h1>
            <div className="friend-buttons">
              {
                (user.id !== page._id && !friends && !incoming && user.id !== 'guestuser123') ?
                <button className='friend-btn' onClick={(e) => handleRequest(e)}>
                  { pending ? 'Cancel Request' : 'Add Friend' }
                </button>
                : null
              }
              {
                incoming ?
                <button className='friend-btn' onClick={(e) => handleRequest(e)}>
                  { accepted ? 'Accepted!' : 'Accept Request' }
                </button>
                : null
              }
              {
                friends ?
                <button className='friend-btn' onClick={(e) => handleDelete(e)}>
                  Remove Friend
                </button>
                : null
              }
              <button className='friend-btn' onClick={(e) => navigate(`/user/${page.username}/friends`)}>
                Friends List
              </button>
            </div>
          </div>
        </div>
        <div className="user-contents">
          <About user={user} page={page} />
          <div className="user-posts">
            <NewPost userID={user.id} targetID={page._id} />
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