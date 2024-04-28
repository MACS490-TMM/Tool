import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";  // Adjust the path if necessary

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, getUserRole } = useAuth();
    const userRole = getUserRole();
    const isAllowed = allowedRoles.includes(userRole);

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (!isAllowed) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;