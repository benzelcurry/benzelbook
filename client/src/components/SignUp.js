import React from 'react';

import Nav from './Nav';
import Footer from './Footer';
import '../stylesheets/SignUp.css';

const SignUp = () => {
  return (
    <div>
      <Nav />
      <div className="signup-container">
        <form action="" method="POST" className='signup-form'>
          <div className="signup-inputs">
            <label htmlFor="first_name">First Name: </label>
            <input type="text" name='first_name' id='first_name' placeholder='First Name' />
            
            <label htmlFor="family_name">Family Name: </label>
            <input type="text" name='family_name' id='family_name' placeholder='Family Name' />
            <label htmlFor="username">Username: </label>
            <input type="text" name='username' id='username' placeholder='Username' />
            <label htmlFor="password">Password: </label>
            <input type="password" name='password' id='password' placeholder='Password' />
            <label htmlFor="confirm_password">Confirm Password: </label>
            <input type="confirm_password" name='confirm_password' id='confirm_password' placeholder='Confirm Password' />
          </div>

          <button className='signup-form-btn'>Sign Up</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;