import React from "react";
import { Navigate } from 'react-router-dom';
const PermissionRoute = ({ children, allowedRoles }) => {
  const storedData = localStorage.getItem('user');
  let userRole = null;  
    if (storedData) {
        const userData = JSON.parse(storedData);
        if (userData && userData.role) {
            userRole = userData.role;
        }
    }
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};
export default PermissionRoute; 