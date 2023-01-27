// Router component
// Using hash router because some hosting services struggle with regular router

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import LogIn from './LogIn';
import SignUp from './SignUp';
import User from './User';
import NoUser from './NoUser';

const RouteSwitch = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={ <App /> } />
        <Route path='login' element={ <LogIn /> } />
        <Route path='signup' element={ <SignUp /> } />
        <Route path='user/404' element={ <NoUser /> } />
        <Route path='user/:username' element={ <User /> } />
      </Routes>
    </HashRouter>
  );
};

export default RouteSwitch;