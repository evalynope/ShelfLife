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
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2 className="nav-title">Shelf Life</h2>
      <div className="nav-links">
        <Link to="/search">Search Books</Link>
        <Link to="/dashboard">My TBR Shelf</Link>
        <Link to="/">Home</Link>
        <Link to="/mytitles">Read</Link>

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
