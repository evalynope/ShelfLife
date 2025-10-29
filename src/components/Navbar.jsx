import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="nav-title">Shelf Life</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">My TBR List</Link>
        <Link to="/mytitles">My Titles</Link>
      </div>
    </nav>
  );
}

export default Navbar;
