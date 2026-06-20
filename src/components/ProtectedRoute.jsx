import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ children }) {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    // Redirect to login page and save the current location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
