// Homepage component

import React from 'react';

import Nav from './Nav';
import Footer from './Footer';
import '../stylesheets/App.css';

const App = () => {
  return (
    <div>
      <Nav />
      <div className="app">
        Hello, World!
      </div>
      <Footer />
    </div>
  );
};

export default App;