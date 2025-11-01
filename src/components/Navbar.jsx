import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/UserAPI";
import "./Navbar.css";

function Navbar({ userLoggedIn, setUserLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logoutUser();
    setUserLoggedIn(false);
    navigate(0);
  };

  return (
    <nav className="navbar">
      <h2 className="nav-title">Shelf Life</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/dashboard">My List</Link>
        <Link to="/mytitles">Read</Link>
        <Link to="/search">Search</Link>

        {userLoggedIn ? (
          <Link to="/" onClick={handleLogout}>
            Logout
          </Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
