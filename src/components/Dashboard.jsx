// src/components/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Dashboard</h1>
      <p>Welcome! This is your personal book dashboard.</p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/mytitles")} style={{ marginRight: "10px", padding: "10px 20px" }}>
          My Titles
        </button>
        <button onClick={() => navigate("/")}>
          Home
        </button>
      </div>
    </div>
  );
}

export default Dashboard;

