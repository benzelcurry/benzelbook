// Component for displaying search results

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
        // REMOVE CONSOLE.LOG()'S WHEN SEARCH IS FUNCTIONAL
        const results = response.data.user_list;
        if (location.state.query) {
          const substr = location.state.query.toLowerCase();
          const refined = results.filter(user => 
            user.first_name.toLowerCase().includes(substr) ||
            user.family_name.toLowerCase().includes(substr)
          );
          console.log(refined);
          return setUsers(refined);
        }
        console.log(response.data.user_list);
        return setUsers(response.data.user_list);
      });
  }, [location.state.query]);

  return (
    <div>
      <Nav />
      <div className="search-container">
        {/* MAKE SEARCH RESULTS FOR USERS MAP TO HERE;
          CREATE A COMPONENT FOR USER CARD PREVIEWS THAT LINK
          TO THE RESPECTIVE PROFILE */}
        { users.map((user) => 
          <ProfilePreview key={user._id} user={user} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Search;