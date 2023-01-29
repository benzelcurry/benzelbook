// Router component
// Using hash router because some hosting services struggle with regular router

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import LogIn from './LogIn';
import SignUp from './SignUp';
import Search from './Search';
import User from './User';
import Error from './Error';
import FriendRequests from './FriendRequests';

const RouteSwitch = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={ <App /> } />
        <Route path='login' element={ <LogIn /> } />
        <Route path='signup' element={ <SignUp /> } />
        <Route path='search' element={ <Search /> } />
        <Route path='friend-requests' element={ <FriendRequests /> } />
        <Route path='user/:username' element={ <User /> } />
        <Route path='*' element={ <Error /> } />
      </Routes>
    </HashRouter>
  );
};

export default RouteSwitch;