// Component for displaying search results

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

import Nav from './Nav';
import Footer from './Footer';
import ProfilePreview from './ProfilePreview';
import '../stylesheets/Search.css';

const Search = ({ query }) => {
  const location = useLocation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/users`)
      .then((response) => {
        const results = response.data.user_list;
        if (location.state.query) {
          const substr = location.state.query.toLowerCase();
          const refined = results.filter(user => 
            user.first_name.toLowerCase().includes(substr) ||
            user.family_name.toLowerCase().includes(substr)
          );
          return setUsers(refined);
        }
        return setUsers(response.data.user_list);
      });
  }, [location.state.query]);

  return (
    <div>
      <Nav />
      <div className="search-container">
        { users.map((user) => 
          <Link to={`/user/${user.username}`} className='preview-link'>
            <ProfilePreview key={user._id} user={user} />
          </Link>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Search;