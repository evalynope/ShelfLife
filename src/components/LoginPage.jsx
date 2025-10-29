import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/UserAPI";

function LoginPage({ setUserLoggedIn, setCurrentUserEmail }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      // Call your API to login
      await loginUser({ email, password });

      // Update app login state
      setUserLoggedIn(true);
      setCurrentUserEmail(email); // <-- add this


      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Login</h2>
      <form
        onSubmit={handleLogin}
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

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          type="submit"
          style={{ marginTop: "10px", padding: "8px 16px" }}
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginPage;

