import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import App from './App';
import LogIn from './LogIn';

const RouteSwitch = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={ <App /> } />
        <Route path='login' element={ <LogIn /> } />
      </Routes>
    </HashRouter>
  );
};

export default RouteSwitch;