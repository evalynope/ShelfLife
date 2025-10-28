// src/components/ProtectedRoute.jsx
function ProtectedRoute({ userLoggedIn, children, setShowModal }) {
  if (userLoggedIn) {
    return children; // allow access
  } else {
    setShowModal(true); // show modal
    return null; // block access
  }
}

export default ProtectedRoute;
