import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/UserAPI";

// <-- Place it here, above the component
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function Signup({ setUserLoggedIn, setCurrentUserEmail }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter an email and password.");
      return;
    }

        if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // Call your API
      await registerUser({ email, password, displayName });

      // Mark user as logged in
      setUserLoggedIn(true);
      setCurrentUserEmail(email);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Sign Up</h2>
      <form
        onSubmit={handleSignup}
        style={{ display: "inline-block", textAlign: "left" }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Display Name (optional):</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" style={{ marginTop: "10px", padding: "8px 16px" }}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;

