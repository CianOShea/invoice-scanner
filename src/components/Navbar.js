import React from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';

const Navbar = () => {
  return (
    <div>
      <h5>NAVBAR</h5>
      <ul>
        <li><Link to="/Invoice">Invoice</Link></li>
        <li><Link to="/Bank">Bank</Link></li>
        <li><Link to="/Login">Login</Link></li>
     	</ul>
      <hr />
    </div>
  );
};

export default Navbar;