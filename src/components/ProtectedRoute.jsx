// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../api/UserAPI";

function ProtectedRoute({ children, setShowModal }) {
  const user = getCurrentUser();

  if (!user || !user.email) {
    // Show modal if provided, but still navigate safely
    if (setShowModal) setShowModal(true);
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
