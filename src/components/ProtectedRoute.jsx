import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ requiredPermissions, children }) => {
  const { user, permissions } = useUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const hasPermissions = requiredPermissions.every(permission => 
    permissions.includes(permission)
  );

  if (!hasPermissions) {
    return <Navigate to="/access-denied" />;
  }

  return children;
};

export default ProtectedRoute;
