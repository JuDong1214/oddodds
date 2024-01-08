import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="Navbar">
            <NavLink to="/"  activeClassName="Navbar-active" end>Home</NavLink>
            <NavLink to="/NBA"  activeClassName="Navbar-active" end>NBA</NavLink>
        </nav>
    )
}

export default Navbar;