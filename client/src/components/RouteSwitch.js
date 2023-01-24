// Router component
// Using hash router because some hosting services struggle with regular router

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import LogIn from './LogIn';
import SignUp from './SignUp';

const RouteSwitch = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={ <App /> } />
        <Route path='login' element={ <LogIn /> } />
        <Route path='signup' element={ <SignUp /> } />
      </Routes>
    </HashRouter>
  );
};

export default RouteSwitch;