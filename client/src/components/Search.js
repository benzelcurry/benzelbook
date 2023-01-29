// Component for displaying search results

import React from 'react';
import { useLocation } from 'react-router-dom';

import Nav from './Nav';
import Footer from './Footer';
import '../stylesheets/Search.css';

const Search = ({ query }) => {
  const location = useLocation();

  return (
    <div>
      <Nav />
      <div className="search-container">
        Search results will go here.

        <p>Query: {location.state ? location.state.query : null}</p>
      </div>
      <Footer />
    </div>
  );
};

export default Search;