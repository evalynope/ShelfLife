// src/components/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // optional styling

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1>Welcome to Shelf Life</h1>
      <p>Your personal tracker for books you want to read.</p>

      <div className="home-buttons">
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
    </div>
  );
}

export default Home;
