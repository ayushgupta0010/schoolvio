import React from "react";
import { Link } from "react-router-dom";

const LoggedOut = () => (
  <div>
    <button
      className='navbar-toggler'
      type='button'
      data-bs-toggle='collapse'
      data-bs-target='#loggedOut'
      aria-controls='loggedOut'
      aria-expanded='false'
      aria-label='Toggle navigation'>
      <span className='navbar-toggler-icon' />
    </button>
    <div className='collapse navbar-collapse' id='loggedOut'>
      <ul className='navbar-nav'>
        <Link className='nav-item nav-link' to='/login'>
          Login
        </Link>
        <Link className='nav-item nav-link' to='/signup'>
          Signup
        </Link>
      </ul>
    </div>
  </div>
);

export default LoggedOut;
