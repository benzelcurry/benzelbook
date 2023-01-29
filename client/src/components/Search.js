// Component for displaying search results

import React from 'react';

import Nav from './Nav';
import Footer from './Footer';
import '../stylesheets/Search.css';

const Search = () => {
  return (
    <div>
      <Nav />
      <div className="search-container">
        Search results will go here.
      </div>
      <Footer />
    </div>
  );
};

export default Search;