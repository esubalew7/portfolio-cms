import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  // If no token exists, redirect to login with the current location as state
  // so we can redirect back after successful login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If token exists, render the protected content
  return children;
};

export default ProtectedRoute;