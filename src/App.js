import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import Signup from "./components/Signup";
import Dashboard from "./components/TBR";
import MyTitles from "./components/MyTitles";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchBooks from "./components/SearchBooks";
// import Status from "./components/Status";

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
 

  const handleCloseModal = () => setShowModal(false);

  return (
  <Router>
    <Navbar userLoggedIn={userLoggedIn} />

    {/* Modal for not-logged-in warning */}
    {showModal && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <p>You must be logged in to view this page.</p>
          <button onClick={handleCloseModal}>Close</button>
        </div>
      </div>
    )}

    <Routes>
      <Route path="/" element={<Home />} />

      {/* Login route */}
      <Route
        path="/login"
        element={
          <LoginPage
            setUserLoggedIn={setUserLoggedIn}
            setCurrentUserEmail={setCurrentUserEmail}
          />
        }
      />

      {/* Signup route */}
      <Route
        path="/signup"
        element={
          <Signup
            setUserLoggedIn={setUserLoggedIn}
            setCurrentUserEmail={setCurrentUserEmail}
          />
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute userLoggedIn={userLoggedIn} setShowModal={setShowModal}>
            <Dashboard currentUserEmail={currentUserEmail} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mytitles"
        element={
          <ProtectedRoute userLoggedIn={userLoggedIn} setShowModal={setShowModal}>
            <MyTitles currentUserEmail={currentUserEmail} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/search"
        element={
          <ProtectedRoute userLoggedIn={userLoggedIn} setShowModal={setShowModal}>
            <SearchBooks 
            currentUserEmail={currentUserEmail} 
            setUserBooks={setUserBooks}/>
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

}

export default App;
