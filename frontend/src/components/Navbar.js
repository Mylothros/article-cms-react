import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './styles/navbar.scss';

const Navbar = () => {
  return (
    <div>
      <nav className="navbar">
        <ul className="nav-links">
          <li>
            <Link to="/admin">Admin</Link>
          </li>
          <li>
            <Link to="/">Articles</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default Navbar;