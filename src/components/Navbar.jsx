import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="nav-title">Shelf Life</h2>
      <div className="nav-links">
        <Link to="/search">Search Books</Link>
        <Link to="/dashboard">My TBR Shelf</Link>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/mytitles">Read</Link>
      </div>
    </nav>
  );
}

export default Navbar;
