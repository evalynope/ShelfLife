import { Navigate } from "react-router-dom";

function ProtectedRoute({ userLoggedIn, setShowModal, children }) {
  if (!userLoggedIn) {
    setShowModal(true);
    return <Navigate to="/login" />;
  }
  return children;
}

export default ProtectedRoute;
