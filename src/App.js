import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import Signup from "./components/Signup";
import Dashboard from "./components/TBR";
import MyTitles from "./components/MyTitles";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchBooks from "./components/SearchBooks";
import { getCurrentUser } from "./api/UserAPI";
import "./App.css"

// import Status from "./components/Status";



function App() {
  const initialUser = getCurrentUser();
  const [currentUserEmail, setCurrentUserEmail] = useState(() => initialUser?.email ?? null);
  const [userLoggedIn, setUserLoggedIn] = useState(() => !!initialUser);
  const [showModal, setShowModal] = useState(false);
 
  useEffect(() => {
  const storedUser = getCurrentUser();
  if (storedUser) {
    setUserLoggedIn(true);
    setCurrentUserEmail(storedUser.email);
  }
}, [])

const handleLogout = () => {
  setUserLoggedIn(false);
  setCurrentUserEmail(null);
};

  return (
  <Router basename="/ShelfLife">
    <Navbar
    userLoggedIn={userLoggedIn}
    setUserLoggedIn={setUserLoggedIn} 
    setCurrentUserEmail={setCurrentUserEmail}
    handleLogout={handleLogout}
    />



    {/* Modal for not-logged-in warning */}
{showModal && (
  <div
    className="modal-overlay"
    role="dialog"
    aria-modal="true"
    onClick={() => setShowModal(false)}   // click backdrop to close
  >
    <div
      className="modal-content"
      onClick={(e) => e.stopPropagation()} // don't close when clicking the box
    >
      <p>You must be logged in to view this page.</p>
      <button className="modal-close" onClick={() => setShowModal(false)}>
        Close
      </button>
    </div>
  </div>
)}

    <Routes>
      <Route path="/" element={<Home currentUserEmail={currentUserEmail}/>} />

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
      />
    </ProtectedRoute>
  }
/>

    </Routes>
  </Router>
);

}

export default App;
